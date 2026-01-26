import { CarLoan, PayoffProjection, AmortizationEntry } from "@/types/vehicleCarol";

export function calculateMonthlyEquivalentPayment(loan: CarLoan): number {
  if (loan.paymentFrequency === "monthly") {
    return loan.paymentAmount;
  }
  // Biweekly: 2 payments per month (payment already includes interest)
  return loan.paymentAmount * 2;
}

export function calculateMonthlyInterest(balance: number, aprPercent: number): number {
  return (balance * (aprPercent / 100)) / 12;
}

export function calculateDailyInterest(balance: number, aprPercent: number): number {
  return (balance * (aprPercent / 100)) / 365;
}

export function calculateNextPaymentWithExtra(
  currentBalance: number,
  regularPayment: number,
  extraAmount: number,
  aprPercent: number
): {
  totalPayment: number;
  interestPortion: number;
  principalPortion: number;
  newBalance: number;
  extraApplied: number;
} {
  const monthlyInterest = calculateMonthlyInterest(currentBalance, aprPercent);
  const regularPrincipal = Math.max(0, regularPayment - monthlyInterest);
  const totalPayment = regularPayment + extraAmount;
  const principalPortion = regularPrincipal + extraAmount;
  const newBalance = Math.max(0, currentBalance - principalPortion);

  return {
    totalPayment,
    interestPortion: monthlyInterest,
    principalPortion,
    newBalance,
    extraApplied: extraAmount,
  };
}

export function calculatePayoffProjection(
  loan: CarLoan
): PayoffProjection {
  const monthlyPayment = calculateMonthlyEquivalentPayment(loan) + loan.extraPaymentMonthly;
  
  // Since payments already include interest, we calculate simply:
  // Total months = Balance / Monthly Payment
  const estimatedMonths = Math.ceil(loan.balance / monthlyPayment);
  const totalPaid = loan.balance; // No extra interest - it's already in payments
  
  // Build simple amortization schedule (no interest calculation - already embedded)
  const schedule: AmortizationEntry[] = [];
  let balance = loan.balance;
  
  for (let month = 1; month <= estimatedMonths && balance > 0; month++) {
    const payment = Math.min(monthlyPayment, balance);
    balance = Math.max(0, balance - payment);
    
    schedule.push({
      month,
      payment,
      principal: payment, // All payment goes to principal (interest already included)
      interest: 0, // Interest already embedded in payment amount
      balance,
      extraPayment: loan.extraPaymentMonthly,
    });
  }

  return {
    estimatedMonthsRemaining: estimatedMonths,
    estimatedTotalInterestRemaining: 0, // Interest already included in payments
    estimatedTotalPaidRemaining: totalPaid,
    amortizationSchedule: schedule,
  };
}

export function calculateNegativeEquity(balance: number, marketValue: number): number | null {
  if (marketValue <= 0) return null;
  if (balance > marketValue) {
    return balance - marketValue;
  }
  return null;
}
