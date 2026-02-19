import { describe, expect, it } from "vitest";
import {
  calculateDailyInterest,
  calculateMonthlyEquivalentPayment,
  calculateMonthlyInterest,
  calculateNegativeEquity,
  calculatePayoffProjection,
} from "./carLoanCalculations";

describe("carLoanCalculations", () => {
  it("converts biweekly payment to monthly equivalent", () => {
    const loan = {
      balance: 10000,
      aprPercent: 7,
      paymentAmount: 250,
      paymentFrequency: "biweekly" as const,
      estimatedCarMarketValue: 0,
      extraPaymentMonthly: 0,
    };

    expect(calculateMonthlyEquivalentPayment(loan)).toBe(500);
  });

  it("calculates monthly and daily interest", () => {
    expect(calculateMonthlyInterest(12000, 12)).toBe(120);
    expect(calculateDailyInterest(3650, 10)).toBeCloseTo(1, 6);
  });

  it("creates payoff projection with extra payment", () => {
    const loan = {
      balance: 1000,
      aprPercent: 9,
      paymentAmount: 200,
      paymentFrequency: "monthly" as const,
      estimatedCarMarketValue: 0,
      extraPaymentMonthly: 50,
    };

    const projection = calculatePayoffProjection(loan);
    expect(projection.estimatedMonthsRemaining).toBe(4);
    expect(projection.amortizationSchedule.length).toBe(4);
    expect(projection.amortizationSchedule.at(-1)?.balance).toBe(0);
  });

  it("calculates negative equity only when underwater", () => {
    expect(calculateNegativeEquity(20000, 17000)).toBe(3000);
    expect(calculateNegativeEquity(15000, 17000)).toBeNull();
  });
});
