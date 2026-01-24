import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CarLoan } from "@/types/vehicleCarol";
import { calculateMonthlyEquivalentPayment, calculateNextPaymentWithExtra } from "@/utils/carLoanCalculations";
import { Calculator, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NextPaymentSimulatorProps {
  loan: CarLoan;
}

const NextPaymentSimulator: React.FC<NextPaymentSimulatorProps> = ({ loan }) => {
  const [extraAmount, setExtraAmount] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);

  const monthlyPayment = calculateMonthlyEquivalentPayment(loan);
  const result = calculateNextPaymentWithExtra(loan.balance, monthlyPayment, extraAmount, loan.aprPercent);

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleSimulate = () => {
    setShowResult(true);
  };

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Calculator size={20} strokeWidth={1.5} className="text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-light">Simulador Próxima Parcela</h3>
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Next Payment Simulator</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-muted/30 space-y-1">
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Saldo Atual</p>
          <p className="text-xl font-light">{formatCurrency(loan.balance)}</p>
        </div>

        <div className="p-3 rounded-xl bg-muted/30 space-y-1">
          <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Parcela Normal</p>
          <p className="text-lg font-light">{formatCurrency(monthlyPayment)}</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-light uppercase tracking-wider text-muted-foreground">
            Valor Extra a Pagar ($)
          </label>
          <Input
            type="number"
            value={extraAmount || ""}
            onChange={(e) => {
              setExtraAmount(Math.max(0, parseFloat(e.target.value) || 0));
              setShowResult(false);
            }}
            className="rounded-xl font-light"
            placeholder="0"
            min={0}
          />
        </div>

        <Button onClick={handleSimulate} className="w-full rounded-xl" variant="outline">
          <Sparkles size={16} className="mr-2" />
          Simular Pagamento
        </Button>
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3 pt-2 border-t border-border/30"
          >
            <h4 className="text-xs font-light uppercase tracking-wider text-muted-foreground">
              Resultado da Simulação
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-primary/5 space-y-1">
                <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Pagamento Total</p>
                <p className="text-lg font-light text-primary">{formatCurrency(result.totalPayment)}</p>
              </div>

              <div className="p-3 rounded-xl bg-destructive/5 space-y-1">
                <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Juros na Parcela</p>
                <p className="text-lg font-light text-destructive">{formatCurrency(result.interestPortion)}</p>
              </div>

              <div className="p-3 rounded-xl bg-accent/5 space-y-1">
                <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Amortização</p>
                <p className="text-lg font-light text-accent">{formatCurrency(result.principalPortion)}</p>
              </div>

              <div className="p-3 rounded-xl bg-muted/50 space-y-1">
                <p className="text-[10px] text-muted-foreground font-light uppercase tracking-wider">Novo Saldo</p>
                <p className="text-lg font-light">{formatCurrency(result.newBalance)}</p>
              </div>
            </div>

            {extraAmount > 0 && (
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-sm font-light text-accent">
                  Com {formatCurrency(extraAmount)} extra, você reduz {formatCurrency(result.principalPortion - (monthlyPayment - result.interestPortion))} a mais do principal!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NextPaymentSimulator;
