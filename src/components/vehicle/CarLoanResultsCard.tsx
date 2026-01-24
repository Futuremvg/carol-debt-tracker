import React from "react";
import { CarLoan, PayoffProjection } from "@/types/vehicleCarol";
import {
  calculateMonthlyEquivalentPayment,
  calculateMonthlyInterest,
  calculateDailyInterest,
  calculateNegativeEquity,
} from "@/utils/carLoanCalculations";
import { AlertTriangle, TrendingDown, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface CarLoanResultsCardProps {
  loan: CarLoan;
  projection: PayoffProjection;
}

const CarLoanResultsCard: React.FC<CarLoanResultsCardProps> = ({ loan, projection }) => {
  const monthlyPayment = calculateMonthlyEquivalentPayment(loan);
  const monthlyInterest = calculateMonthlyInterest(loan.balance, loan.aprPercent);
  const dailyInterest = calculateDailyInterest(loan.balance, loan.aprPercent);
  const negativeEquity = calculateNegativeEquity(loan.balance, loan.estimatedCarMarketValue);

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatYearsMonths = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${remainingMonths} meses`;
    if (remainingMonths === 0) return `${years} anos`;
    return `${years} anos e ${remainingMonths} meses`;
  };

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <TrendingDown size={20} strokeWidth={1.5} className="text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-light">Resultados do Financiamento</h3>
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Car Loan Results</p>
        </div>
      </div>

      {/* Negative Equity Warning */}
      {negativeEquity !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-destructive" />
            <div>
              <p className="text-sm font-light text-destructive">Patrimônio Negativo</p>
              <p className="text-[10px] text-destructive/80">
                Você deve {formatCurrency(negativeEquity)} a mais que o valor do carro.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-muted/30 space-y-1">
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Pagamento Mensal Equiv.</p>
          <p className="text-lg font-light">{formatCurrency(monthlyPayment)}</p>
        </div>

        <div className="p-3 rounded-xl bg-muted/30 space-y-1">
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Juros Mensal Aprox.</p>
          <p className="text-lg font-light">{formatCurrency(monthlyInterest)}</p>
        </div>

        <div className="p-3 rounded-xl bg-muted/30 space-y-1">
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Juros Diário Aprox.</p>
          <p className="text-lg font-light">{formatCurrency(dailyInterest)}</p>
        </div>

        <div className="p-3 rounded-xl bg-muted/30 space-y-1">
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Tempo Restante Est.</p>
          <p className="text-lg font-light">{formatYearsMonths(projection.estimatedMonthsRemaining)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-destructive/5 space-y-1">
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Total Juros Restante</p>
          <p className="text-lg font-light text-destructive">{formatCurrency(projection.estimatedTotalInterestRemaining)}</p>
        </div>

        <div className="p-3 rounded-xl bg-accent/5 space-y-1">
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Total a Pagar</p>
          <p className="text-lg font-light">{formatCurrency(projection.estimatedTotalPaidRemaining)}</p>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground font-light text-center">
        Estimativas são aproximações e dependem das regras do financiador.
      </p>
    </div>
  );
};

export default CarLoanResultsCard;
