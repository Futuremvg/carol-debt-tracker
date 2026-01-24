export interface CarLoan {
  balance: number;
  aprPercent: number;
  paymentAmount: number;
  paymentFrequency: "biweekly" | "monthly";
  estimatedCarMarketValue: number;
  extraPaymentMonthly: number;
}

export interface InsurancePaidByCarol {
  monthlyAmount: number;
}

export interface CarolCreditLine {
  balance: number;
  monthlyInterestCost: number;
  monthlyPayment: number;
}

export interface VehicleCarolData {
  carLoan: CarLoan;
  insurancePaidByCarol: InsurancePaidByCarol;
  carolCreditLine: CarolCreditLine;
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  extraPayment: number;
}

export interface PayoffProjection {
  estimatedMonthsRemaining: number;
  estimatedTotalInterestRemaining: number;
  estimatedTotalPaidRemaining: number;
  amortizationSchedule: AmortizationEntry[];
}

export const defaultVehicleCarolData: VehicleCarolData = {
  carLoan: {
    balance: 40000,
    aprPercent: 9.99,
    paymentAmount: 418,
    paymentFrequency: "biweekly",
    estimatedCarMarketValue: 0,
    extraPaymentMonthly: 0,
  },
  insurancePaidByCarol: {
    monthlyAmount: 0,
  },
  carolCreditLine: {
    balance: 7000,
    monthlyInterestCost: 63.73,
    monthlyPayment: 0,
  },
};
