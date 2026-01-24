import React from "react";
import { VehicleCarolData, PayoffProjection } from "@/types/vehicleCarol";
import { calculateMonthlyEquivalentPayment } from "@/utils/carLoanCalculations";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface CombinedSummaryCardProps {
  data: VehicleCarolData;
}

const CombinedSummaryCard: React.FC<CombinedSummaryCardProps> = ({ data }) => {
  const carMonthlyPayment = calculateMonthlyEquivalentPayment(data.carLoan);
  const insuranceMonthly = data.insurancePaidByCarol.monthlyAmount;
  const creditLineInterest = data.carolCreditLine.monthlyInterestCost;
  const totalMonthlyImpact = carMonthlyPayment + insuranceMonthly + creditLineInterest;

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="balance-gradient rounded-2xl p-5 text-primary-foreground shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <motion.div 
          className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Wallet size={20} strokeWidth={1.5} />
        </motion.div>
        <div>
          <h3 className="text-sm font-light">Impacto Mensal Total</h3>
          <p className="text-[10px] font-light uppercase tracking-wider opacity-70">Vehicle + Carol</p>
        </div>
      </div>

      <motion.div 
        className="text-3xl font-extralight tracking-tight mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {formatCurrency(totalMonthlyImpact)}
      </motion.div>

      <div className="space-y-2">
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <span className="text-xs font-light opacity-80">Financiamento Carro</span>
          <span className="font-light">{formatCurrency(carMonthlyPayment)}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <span className="text-xs font-light opacity-80">Seguro (Carol)</span>
          <span className="font-light">{formatCurrency(insuranceMonthly)}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-xs font-light opacity-80">Juros Credit Line (Carol)</span>
          <span className="font-light">{formatCurrency(creditLineInterest)}</span>
        </div>
      </div>
    </div>
  );
};

export default CombinedSummaryCard;
