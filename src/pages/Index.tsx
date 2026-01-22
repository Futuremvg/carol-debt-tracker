import React from "react";
import MainLayout from "@/components/MainLayout";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";

interface CreditConfig {
  initialBalance: number;
  interestRate: number;
  interestType: "monthly" | "annual";
}

interface CreditItem {
  id: string;
  description: string;
  value: number;
  date: string;
  type: "expense" | "payment";
}

interface FixedPayment {
  id: string;
  description: string;
  value: number;
  frequency: "mensal" | "quinzenal" | "semanal";
  dueDay: number;
}

function getCreditData() {
  try {
    const config: CreditConfig = JSON.parse(localStorage.getItem("credit-line-config") || '{"initialBalance":0,"interestRate":21,"interestType":"annual"}');
    const items: CreditItem[] = JSON.parse(localStorage.getItem("credit-line-items") || "[]");
    
    const totalExpenses = items.filter(i => i.type === "expense").reduce((acc, i) => acc + i.value, 0);
    const totalPayments = items.filter(i => i.type === "payment").reduce((acc, i) => acc + i.value, 0);
    const currentBalance = config.initialBalance + totalExpenses - totalPayments;
    const monthlyInterest = config.interestType === "monthly" 
      ? (currentBalance * config.interestRate) / 100 
      : (currentBalance * config.interestRate) / 100 / 12;
    
    return { currentBalance, monthlyInterest };
  } catch {
    return { currentBalance: 0, monthlyInterest: 0 };
  }
}

function getFixedPaymentsData() {
  try {
    const items: FixedPayment[] = JSON.parse(localStorage.getItem("fixed-payments") || "[]");
    
    const totalMensal = items.reduce((acc, i) => {
      let factor = 1;
      if (i.frequency === "quinzenal") factor = 2;
      if (i.frequency === "semanal") factor = 4;
      return acc + i.value * factor;
    }, 0);
    
    // Find first two payments for display
    const firstPayment = items[0];
    const secondPayment = items[1];
    
    return { totalMensal, firstPayment, secondPayment };
  } catch {
    return { totalMensal: 0, firstPayment: undefined, secondPayment: undefined };
  }
}

const frequencyLabels: Record<string, string> = {
  mensal: "Mensal",
  quinzenal: "Bi-weekly",
  semanal: "Semanal",
};

const Index = () => {
  const [creditData, setCreditData] = React.useState(getCreditData);
  const [fixedData, setFixedData] = React.useState(getFixedPaymentsData);

  // Refresh data when component mounts or window focuses
  React.useEffect(() => {
    const refresh = () => {
      setCreditData(getCreditData());
      setFixedData(getFixedPaymentsData());
    };
    
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    
    // Also refresh on mount
    refresh();
    
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const formatCurrency = (val: number) =>
    `CAD $${val.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalEstimado = fixedData.totalMensal + creditData.monthlyInterest;

  const currentMonth = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        {/* Greeting */}
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs text-ultrathin uppercase tracking-widest">Bom dia</p>
          <h1 className="text-2xl font-light tracking-tight">Dashboard</h1>
        </div>

        {/* Main Balance Card */}
        <div className="balance-gradient rounded-2xl p-6 text-primary-foreground shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-light uppercase tracking-widest opacity-80">Credit Line Balance</span>
            <TrendingUp size={18} strokeWidth={1.5} className="opacity-70" />
          </div>
          <div className="space-y-2">
            <span className="text-4xl font-extralight tracking-tight">{formatCurrency(creditData.currentBalance)}</span>
            <p className="text-xs font-light opacity-70 tracking-wide">Dívida total em aberto</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-destructive/8 flex items-center justify-center">
                <ArrowUpRight className="text-destructive" size={18} strokeWidth={1.5} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-light tracking-wide">
                {fixedData.firstPayment?.description || "Pagamento 1"}
              </p>
              <p className="text-xl font-light tracking-tight">
                {fixedData.firstPayment ? formatCurrency(fixedData.firstPayment.value) : formatCurrency(0)}
              </p>
              <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">
                {fixedData.firstPayment ? frequencyLabels[fixedData.firstPayment.frequency] : "—"}
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/8 flex items-center justify-center">
                <ArrowDownRight className="text-accent" size={18} strokeWidth={1.5} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-light tracking-wide">
                {fixedData.secondPayment?.description || "Pagamento 2"}
              </p>
              <p className="text-xl font-light tracking-tight">
                {fixedData.secondPayment ? formatCurrency(fixedData.secondPayment.value) : formatCurrency(0)}
              </p>
              <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">
                {fixedData.secondPayment ? frequencyLabels[fixedData.secondPayment.frequency] : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-light tracking-wide">Resumo Mensal</h2>
            <span className="text-[10px] text-muted-foreground font-light uppercase tracking-widest capitalize">{currentMonth}</span>
          </div>
          
          <div className="space-y-0">
            <div className="flex items-center justify-between py-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-sm font-light text-muted-foreground">Pagamentos Fixos</span>
              </div>
              <span className="font-light tracking-tight">{formatCurrency(fixedData.totalMensal)}</span>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                <span className="text-sm font-light text-muted-foreground">Juros Credit Line</span>
              </div>
              <span className="font-light tracking-tight">{formatCurrency(creditData.monthlyInterest)}</span>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-sm font-light">Total Estimado</span>
              </div>
              <span className="text-lg font-light tracking-tight">{formatCurrency(totalEstimado)}</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
