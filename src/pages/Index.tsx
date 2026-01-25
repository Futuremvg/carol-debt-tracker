import React from "react";
import MainLayout from "@/components/MainLayout";
import { ArrowDownRight, ArrowUpRight, TrendingUp, Bell, AlertCircle, Clock, CheckCircle, Sparkles, Car } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { getStoredVehicleCarolData } from "@/hooks/useVehicleCarolData";
import { calculateMonthlyEquivalentPayment } from "@/utils/carLoanCalculations";

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

interface PaymentAlert {
  payment: FixedPayment;
  daysUntilDue: number;
  status: "overdue" | "today" | "upcoming" | "safe";
}

const motivationalMessages = [
  "Cada pagamento te aproxima da liberdade financeira ✨",
  "Pequenos passos, grandes conquistas 🚀",
  "Você está no controle das suas finanças 💪",
  "Disciplina hoje, prosperidade amanhã 🌟",
  "Sua jornada financeira está evoluindo 📈",
];

function getRandomMotivationalMessage() {
  return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
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
    const annualRate = config.interestType === "annual" ? config.interestRate : config.interestRate * 12;
    
    return { currentBalance, monthlyInterest, annualRate };
  } catch {
    return { currentBalance: 0, monthlyInterest: 0, annualRate: 0 };
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
    
    const firstPayment = items[0];
    const secondPayment = items[1];
    
    return { totalMensal, firstPayment, secondPayment, items };
  } catch {
    return { totalMensal: 0, firstPayment: undefined, secondPayment: undefined, items: [] };
  }
}

function getVehicleCarolData() {
  try {
    const data = getStoredVehicleCarolData();
    const carMonthlyPayment = calculateMonthlyEquivalentPayment(data.carLoan);
    const insuranceMonthly = data.insurancePaidByCarol.monthlyAmount;
    const creditLineInterest = data.carolCreditLine.monthlyInterestCost;
    const totalMonthlyImpact = carMonthlyPayment + insuranceMonthly + creditLineInterest;
    
    return { 
      carMonthlyPayment, 
      insuranceMonthly, 
      creditLineInterest, 
      totalMonthlyImpact,
      carBalance: data.carLoan.balance,
      carolBalance: data.carolCreditLine.balance
    };
  } catch {
    return { carMonthlyPayment: 0, insuranceMonthly: 0, creditLineInterest: 0, totalMonthlyImpact: 0, carBalance: 0, carolBalance: 0 };
  }
}

function calculatePaymentAlerts(payments: FixedPayment[]): PaymentAlert[] {
  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  return payments.map(payment => {
    let daysUntilDue: number;
    
    if (payment.dueDay >= currentDay) {
      daysUntilDue = payment.dueDay - currentDay;
    } else {
      daysUntilDue = (daysInMonth - currentDay) + payment.dueDay;
    }
    
    let status: PaymentAlert["status"];
    if (daysUntilDue === 0) {
      status = "today";
    } else if (daysUntilDue <= 3) {
      status = "upcoming";
    } else if (daysUntilDue > daysInMonth - 3 && payment.dueDay < currentDay) {
      status = "overdue";
      daysUntilDue = currentDay - payment.dueDay;
    } else {
      status = "safe";
    }
    
    return { payment, daysUntilDue, status };
  }).filter(alert => alert.status !== "safe")
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

const frequencyLabels: Record<string, string> = {
  mensal: "Mensal",
  quinzenal: "Bi-weekly",
  semanal: "Semanal",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const alertVariants: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const Index = () => {
  const [creditData, setCreditData] = React.useState(getCreditData);
  const [fixedData, setFixedData] = React.useState(getFixedPaymentsData);
  const [vehicleData, setVehicleData] = React.useState(getVehicleCarolData);
  const [alerts, setAlerts] = React.useState<PaymentAlert[]>([]);
  const [motivationalMessage] = React.useState(getRandomMotivationalMessage);

  React.useEffect(() => {
    const refresh = () => {
      setCreditData(getCreditData());
      const data = getFixedPaymentsData();
      setFixedData(data);
      setAlerts(calculatePaymentAlerts(data.items));
      setVehicleData(getVehicleCarolData());
    };
    
    // Refresh immediately on mount
    refresh();
    
    // Refresh on window focus and storage changes
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    
    // Also refresh on visibility change (when tab becomes visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Periodic refresh every 2 seconds to catch localStorage changes from other components
    const interval = setInterval(refresh, 2000);
    
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalEstimado = fixedData.totalMensal + creditData.monthlyInterest + vehicleData.totalMonthlyImpact;
  const currentMonth = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const getAlertIcon = (status: PaymentAlert["status"]) => {
    switch (status) {
      case "overdue":
        return <AlertCircle size={16} strokeWidth={1.5} />;
      case "today":
        return <Bell size={16} strokeWidth={1.5} />;
      case "upcoming":
        return <Clock size={16} strokeWidth={1.5} />;
      default:
        return <CheckCircle size={16} strokeWidth={1.5} />;
    }
  };

  const getAlertStyles = (status: PaymentAlert["status"]) => {
    switch (status) {
      case "overdue":
        return {
          bg: "bg-destructive/10",
          border: "border-destructive/20",
          icon: "text-destructive",
          text: "text-destructive"
        };
      case "today":
        return {
          bg: "bg-primary/10",
          border: "border-primary/20",
          icon: "text-primary",
          text: "text-primary"
        };
      case "upcoming":
        return {
          bg: "bg-muted",
          border: "border-border",
          icon: "text-muted-foreground",
          text: "text-muted-foreground"
        };
      default:
        return {
          bg: "bg-accent/10",
          border: "border-accent/20",
          icon: "text-accent",
          text: "text-accent"
        };
    }
  };

  const getAlertMessage = (alert: PaymentAlert) => {
    switch (alert.status) {
      case "overdue":
        return `Vencido há ${alert.daysUntilDue} dia${alert.daysUntilDue > 1 ? "s" : ""}`;
      case "today":
        return "Vence hoje";
      case "upcoming":
        return `Vence em ${alert.daysUntilDue} dia${alert.daysUntilDue > 1 ? "s" : ""}`;
      default:
        return "Em dia";
    }
  };

  return (
    <MainLayout>
      <motion.div 
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Motivational Message */}
        <motion.div 
          variants={itemVariants}
          className="glass-card rounded-2xl p-4 border border-accent/20 bg-accent/5"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center"
            >
              <Sparkles size={16} strokeWidth={1.5} className="text-accent" />
            </motion.div>
            <p className="text-sm font-extralight tracking-wide text-foreground/90">{motivationalMessage}</p>
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.div className="space-y-0.5" variants={itemVariants}>
          <p className="text-muted-foreground text-[10px] text-ultrathin uppercase tracking-[0.2em]">Bom dia</p>
          <h1 className="text-xl font-extralight tracking-tight">Dashboard</h1>
        </motion.div>

        {/* Alerts Section */}
        <AnimatePresence mode="popLayout">
          {alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bell size={14} strokeWidth={1.5} className="text-primary" />
                </motion.div>
                <span className="text-xs font-light uppercase tracking-widest text-muted-foreground">
                  Alertas de Vencimento
                </span>
              </div>
              
              <div className="space-y-2">
                {alerts.map((alert, index) => {
                  const styles = getAlertStyles(alert.status);
                  return (
                    <motion.div
                      key={alert.payment.id}
                      variants={alertVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={index}
                      className={`glass-card rounded-xl p-4 border ${styles.border} ${styles.bg}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className={`w-8 h-8 rounded-lg ${styles.bg} flex items-center justify-center ${styles.icon}`}
                            animate={alert.status === "overdue" || alert.status === "today" 
                              ? { scale: [1, 1.05, 1] } 
                              : undefined
                            }
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {getAlertIcon(alert.status)}
                          </motion.div>
                          <div>
                            <p className="text-sm font-light">{alert.payment.description}</p>
                            <p className={`text-[10px] font-light uppercase tracking-wider ${styles.text}`}>
                              {getAlertMessage(alert)}
                            </p>
                          </div>
                        </div>
                        <span className="font-light text-sm">{formatCurrency(alert.payment.value)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Balance Card - Carol Credit Line */}
        <motion.div 
          variants={itemVariants}
          className="balance-gradient rounded-2xl p-5 text-primary-foreground shadow-lg"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] font-extralight uppercase tracking-[0.2em] opacity-80">Credit Line · Carol</span>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <TrendingUp size={16} strokeWidth={1.5} className="opacity-60" />
            </motion.div>
          </div>
          <div className="space-y-3">
            <motion.span 
              className="text-3xl font-extralight tracking-tight block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {formatCurrency(vehicleData.carolBalance || 0)}
            </motion.span>
            <div className="flex items-center gap-4 text-[10px] font-extralight opacity-70 tracking-wide">
              <span>Juros (fixo): {formatCurrency(vehicleData.creditLineInterest)}/mês</span>
            </div>
          </div>
          
          {/* Projeção se não pagar - juros acumulam no saldo */}
          {vehicleData.carolBalance > 0 && vehicleData.creditLineInterest > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[9px] font-extralight uppercase tracking-wider opacity-60 mb-3">
                Se não pagar (juros somam ao saldo dia 10)
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] opacity-60">Próximo mês</span>
                  <span className="text-sm font-light">
                    {formatCurrency(vehicleData.carolBalance + vehicleData.creditLineInterest)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] opacity-60">Em 3 meses</span>
                  <span className="text-sm font-light">
                    {formatCurrency(vehicleData.carolBalance + (vehicleData.creditLineInterest * 3))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] opacity-60">Em 6 meses</span>
                  <span className="text-sm font-light">
                    {formatCurrency(vehicleData.carolBalance + (vehicleData.creditLineInterest * 6))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] opacity-60">Em 12 meses</span>
                  <span className="text-sm font-light text-destructive/80">
                    {formatCurrency(vehicleData.carolBalance + (vehicleData.creditLineInterest * 12))}
                  </span>
                </div>
              </div>
              <p className="text-[8px] opacity-40 mt-2 italic">
                +{formatCurrency(vehicleData.creditLineInterest)} adicionado ao saldo a cada mês
              </p>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          <motion.div 
            className="glass-card rounded-2xl p-4 space-y-3"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-7 h-7 rounded-lg bg-destructive/8 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <ArrowUpRight className="text-destructive" size={14} strokeWidth={1.5} />
              </motion.div>
              <p className="text-[10px] text-muted-foreground font-extralight uppercase tracking-wider truncate">
                {fixedData.firstPayment?.description || "—"}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-lg font-extralight tracking-tight">
                {fixedData.firstPayment ? formatCurrency(fixedData.firstPayment.value) : "—"}
              </p>
              <p className="text-[9px] text-muted-foreground font-extralight uppercase tracking-[0.15em]">
                {fixedData.firstPayment ? frequencyLabels[fixedData.firstPayment.frequency] : ""}
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="glass-card rounded-2xl p-4 space-y-3"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-7 h-7 rounded-lg bg-accent/8 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <ArrowDownRight className="text-accent" size={14} strokeWidth={1.5} />
              </motion.div>
              <p className="text-[10px] text-muted-foreground font-extralight uppercase tracking-wider truncate">
                {fixedData.secondPayment?.description || "—"}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-lg font-extralight tracking-tight">
                {fixedData.secondPayment ? formatCurrency(fixedData.secondPayment.value) : "—"}
              </p>
              <p className="text-[9px] text-muted-foreground font-extralight uppercase tracking-[0.15em]">
                {fixedData.secondPayment ? frequencyLabels[fixedData.secondPayment.frequency] : ""}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Monthly Overview */}
        <motion.div 
          variants={itemVariants}
          className="glass-card rounded-2xl p-5 space-y-4"
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extralight tracking-wide uppercase">Resumo Mensal</h2>
            <span className="text-[9px] text-muted-foreground font-extralight uppercase tracking-[0.2em] capitalize">{currentMonth}</span>
          </div>
          
          <div className="space-y-0">
            <motion.div 
              className="flex items-center justify-between py-3 border-b border-border/30"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2.5">
                <motion.div 
                  className="w-1 h-1 rounded-full bg-primary/70"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-extralight text-muted-foreground tracking-wide">Pagamentos Fixos</span>
              </div>
              <span className="font-extralight text-sm tracking-tight">{formatCurrency(fixedData.totalMensal)}</span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-between py-3 border-b border-border/30"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2.5">
                <motion.div 
                  className="w-1 h-1 rounded-full bg-destructive/70"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <span className="text-xs font-extralight text-muted-foreground tracking-wide">Juros Credit Line</span>
              </div>
              <span className="font-extralight text-sm tracking-tight">{formatCurrency(creditData.monthlyInterest)}</span>
            </motion.div>
            
            {/* Vehicle & Carol Section */}
            {vehicleData.totalMonthlyImpact > 0 && (
              <motion.div 
                className="flex items-center justify-between py-3 border-b border-border/30"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <div className="flex items-center gap-2.5">
                  <motion.div 
                    className="w-1 h-1 rounded-full bg-accent/70"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                  />
                  <span className="text-xs font-extralight text-muted-foreground tracking-wide">Vehicle + Carol</span>
                </div>
                <span className="font-extralight text-sm tracking-tight">{formatCurrency(vehicleData.totalMonthlyImpact)}</span>
              </motion.div>
            )}
            
            <motion.div 
              className="flex items-center justify-between py-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2.5">
                <motion.div 
                  className="w-1 h-1 rounded-full bg-foreground/70"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <span className="text-xs font-extralight tracking-wide">Total Estimado</span>
              </div>
              <motion.span 
                className="text-base font-extralight tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {formatCurrency(totalEstimado)}
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default Index;
