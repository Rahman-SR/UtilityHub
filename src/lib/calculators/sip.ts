export interface SipInput {
  monthlyInvestment: number;
  expectedReturnRate: number;
  investmentYears: number;
}

export interface SipResult {
  investedAmount: number;
  estimatedReturns: number;
  futureValue: number;
  investedPercentage: number;
  returnsPercentage: number;
  isValid: boolean;
  error?: string;
}

export function calculateSIP(input: SipInput): SipResult {
  const { monthlyInvestment, expectedReturnRate, investmentYears } = input;

  if (isNaN(monthlyInvestment) || monthlyInvestment <= 0) {
    return {
      investedAmount: 0,
      estimatedReturns: 0,
      futureValue: 0,
      investedPercentage: 100,
      returnsPercentage: 0,
      isValid: false,
      error: 'Please enter a valid monthly investment amount greater than ₹0.',
    };
  }

  if (isNaN(investmentYears) || investmentYears <= 0 || investmentYears > 50) {
    return {
      investedAmount: 0,
      estimatedReturns: 0,
      futureValue: 0,
      investedPercentage: 100,
      returnsPercentage: 0,
      isValid: false,
      error: 'Please enter an investment duration between 1 and 50 years.',
    };
  }

  if (isNaN(expectedReturnRate) || expectedReturnRate < 0 || expectedReturnRate > 100) {
    return {
      investedAmount: 0,
      estimatedReturns: 0,
      futureValue: 0,
      investedPercentage: 100,
      returnsPercentage: 0,
      isValid: false,
      error: 'Please enter a valid expected annual return rate.',
    };
  }

  const months = investmentYears * 12;
  const i = expectedReturnRate / 12 / 100;

  // SIP Future Value formula: M = P × ({[1 + i]^n - 1} / i) × (1 + i)
  const futureValue =
    i > 0
      ? monthlyInvestment * (((Math.pow(1 + i, months) - 1) / i) * (1 + i))
      : monthlyInvestment * months;

  const investedAmount = monthlyInvestment * months;
  const estimatedReturns = Math.max(0, futureValue - investedAmount);

  const investedPercentage = futureValue > 0 ? (investedAmount / futureValue) * 100 : 100;
  const returnsPercentage = futureValue > 0 ? (estimatedReturns / futureValue) * 100 : 0;

  return {
    investedAmount,
    estimatedReturns,
    futureValue,
    investedPercentage: Math.max(0, Math.min(100, investedPercentage)),
    returnsPercentage: Math.max(0, Math.min(100, returnsPercentage)),
    isValid: true,
  };
}
