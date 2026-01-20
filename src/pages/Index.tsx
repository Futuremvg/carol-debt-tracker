import MainLayout from "@/components/MainLayout";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6 animate-fade-in">
        {/* Greeting */}
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Good morning</p>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>

        {/* Main Balance Card */}
        <div className="balance-gradient rounded-3xl p-6 text-primary-foreground shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium opacity-90">Credit Line Balance</span>
            <TrendingUp size={20} className="opacity-80" />
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-bold tracking-tight">CAD $0.00</span>
            <p className="text-sm opacity-80">Dívida total em aberto</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <ArrowUpRight className="text-destructive" size={20} />
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Pagamento Carro</p>
              <p className="text-xl font-bold tracking-tight mt-1">CAD $0.00</p>
              <p className="text-xs text-muted-foreground mt-1">Bi-weekly</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <ArrowDownRight className="text-accent" size={20} />
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Seguro</p>
              <p className="text-xl font-bold tracking-tight mt-1">CAD $0.00</p>
              <p className="text-xs text-muted-foreground mt-1">Mensal</p>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Resumo Mensal</h2>
            <span className="text-xs text-muted-foreground">Janeiro 2026</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm">Pagamentos Fixos</span>
              </div>
              <span className="font-semibold">CAD $0.00</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                <span className="text-sm">Credit Line</span>
              </div>
              <span className="font-semibold">CAD $0.00</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm">Total Estimado</span>
              </div>
              <span className="font-bold text-lg">CAD $0.00</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
