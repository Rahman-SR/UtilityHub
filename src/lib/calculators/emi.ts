export type TenureType = 'years' | 'months';

export interface EmiInput {
  principal: number;
  annualRate: number;
  tenure: number;
  tenureType: TenureType;
}

export interface EmiResult {
  monthlyEmi: number;
  principal: number;
  totalInterest: number;
  totalPayment: number;
  principalPercentage: number;
  interestPercentage: number;
  totalMonths: number;
  isValid: boolean;
  error?: string;
}

export function calculateEMI(input: EmiInput): EmiResult {
  const { principal, annualRate, tenure, tenureType } = input;

  if (isNaN(principal) || principal <= 0) {
    return {
      monthlyEmi: 0,
      principal: 0,
      totalInterest: 0,
      totalPayment: 0,
      principalPercentage: 100,
      interestPercentage: 0,
      totalMonths: 0,
      isValid: false,
      error: 'Please enter a valid loan amount greater than ₹0.',
    };
  }

  if (isNaN(tenure) || tenure <= 0) {
    return {
      monthlyEmi: 0,
      principal: 0,
      totalInterest: 0,
      totalPayment: 0,
      principalPercentage: 100,
      interestPercentage: 0,
      totalMonths: 0,
      isValid: false,
      error: 'Please enter a valid loan tenure.',
    };
  }

  if (isNaN(annualRate) || annualRate < 0) {
    return {
      monthlyEmi: 0,
      principal: 0,
      totalInterest: 0,
      totalPayment: 0,
      principalPercentage: 100,
      interestPercentage: 0,
      totalMonths: 0,
      isValid: false,
      error: 'Please enter a valid interest rate.',
    };
  }

  const totalMonths = tenureType === 'years' ? tenure * 12 : tenure;
  let monthlyEmi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (annualRate === 0) {
    // Zero interest rate loan
    monthlyEmi = principal / totalMonths;
    totalPayment = principal;
    totalInterest = 0;
  } else {
    // Standard reducing balance formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const R = annualRate / 12 / 100;
    const N = totalMonths;
    const compoundFactor = Math.pow(1 + R, N);
    monthlyEmi = (principal * R * compoundFactor) / (compoundFactor - 1);
    totalPayment = monthlyEmi * N;
    totalInterest = totalPayment - principal;
  }

  const principalPercentage = totalPayment > 0 ? (principal / totalPayment) * 100 : 100;
  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return {
    monthlyEmi,
    principal,
    totalInterest,
    totalPayment,
    principalPercentage: Math.max(0, Math.min(100, principalPercentage)),
    interestPercentage: Math.max(0, Math.min(100, interestPercentage)),
    totalMonths,
    isValid: true,
  };
}
