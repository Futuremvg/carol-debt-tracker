import React from "react";
import MainLayout from "@/components/MainLayout";
import { motion, type Variants } from "framer-motion";
import { useVehicleCarolData } from "@/hooks/useVehicleCarolData";
import { calculatePayoffProjection } from "@/utils/carLoanCalculations";
import CarLoanCard from "@/components/vehicle/CarLoanCard";
import InsuranceCard from "@/components/vehicle/InsuranceCard";
import CarolCreditLineCard from "@/components/vehicle/CarolCreditLineCard";
import CarLoanResultsCard from "@/components/vehicle/CarLoanResultsCard";
import NextPaymentSimulator from "@/components/vehicle/NextPaymentSimulator";
import AmortizationTable from "@/components/vehicle/AmortizationTable";
import CombinedSummaryCard from "@/components/vehicle/CombinedSummaryCard";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const VehicleCarolFinancials: React.FC = () => {
  const { data, updateCarLoan, updateInsurance, updateCreditLine } = useVehicleCarolData();
  const projection = calculatePayoffProjection(data.carLoan);

  return (
    <MainLayout>
      <motion.div
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-0.5">
          <p className="text-muted-foreground text-[10px] font-light uppercase tracking-[0.2em]">
            Finanças
          </p>
          <h1 className="text-xl font-extralight tracking-tight">Vehicle & Carol</h1>
        </motion.div>

        {/* Combined Summary */}
        <motion.div variants={itemVariants}>
          <CombinedSummaryCard data={data} />
        </motion.div>

        {/* Input Cards */}
        <motion.div variants={itemVariants}>
          <CarLoanCard data={data.carLoan} onUpdate={updateCarLoan} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <CarLoanResultsCard loan={data.carLoan} projection={projection} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <NextPaymentSimulator loan={data.carLoan} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <AmortizationTable schedule={projection.amortizationSchedule} />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
          <InsuranceCard data={data.insurancePaidByCarol} onUpdate={updateInsurance} />
          <CarolCreditLineCard data={data.carolCreditLine} onUpdate={updateCreditLine} />
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default VehicleCarolFinancials;
