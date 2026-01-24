import { CarLoan, PayoffProjection, AmortizationEntry } from "@/types/vehicleCarol";

export function calculateMonthlyEquivalentPayment(loan: CarLoan): number {
  if (loan.paymentFrequency === "monthly") {
    return loan.paymentAmount;
  }
  // Biweekly: 26 payments per year / 12 months
  return (loan.paymentAmount * 26) / 12;
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
  const monthlyRate = loan.aprPercent / 100 / 12;

  let balance = loan.balance;
  let totalInterest = 0;
  let totalPaid = 0;
  const schedule: AmortizationEntry[] = [];

  let month = 0;
  const maxMonths = 360; // 30 years max to prevent infinite loop

  while (balance > 0.01 && month < maxMonths) {
    month++;
    const interest = balance * monthlyRate;
    const regularPayment = calculateMonthlyEquivalentPayment(loan);
    let payment = regularPayment + loan.extraPaymentMonthly;

    // If payment is greater than balance + interest, adjust
    if (payment > balance + interest) {
      payment = balance + interest;
    }

    const principal = payment - interest;
    balance = Math.max(0, balance - principal);

    totalInterest += interest;
    totalPaid += payment;

    schedule.push({
      month,
      payment,
      principal,
      interest,
      balance,
      extraPayment: loan.extraPaymentMonthly,
    });
  }

  return {
    estimatedMonthsRemaining: month,
    estimatedTotalInterestRemaining: totalInterest,
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
