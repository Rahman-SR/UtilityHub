export type GstMode = 'exclusive' | 'inclusive';

export interface GstInput {
  amount: number;
  rate: number;
  mode: GstMode;
}

export interface GstResult {
  netAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  isValid: boolean;
  error?: string;
}

export function calculateGST(input: GstInput): GstResult {
  const { amount, rate, mode } = input;

  if (isNaN(amount) || amount < 0) {
    return {
      netAmount: 0,
      gstAmount: 0,
      totalAmount: 0,
      cgst: 0,
      sgst: 0,
      isValid: false,
      error: 'Please enter a valid positive amount.',
    };
  }

  if (isNaN(rate) || rate < 0 || rate > 100) {
    return {
      netAmount: 0,
      gstAmount: 0,
      totalAmount: 0,
      cgst: 0,
      sgst: 0,
      isValid: false,
      error: 'Please enter a valid GST rate between 0% and 100%.',
    };
  }

  let netAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (mode === 'exclusive') {
    // Add GST to base amount
    netAmount = amount;
    gstAmount = (amount * rate) / 100;
    totalAmount = amount + gstAmount;
  } else {
    // Amount includes GST, remove GST component
    totalAmount = amount;
    netAmount = amount / (1 + rate / 100);
    gstAmount = totalAmount - netAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return {
    netAmount,
    gstAmount,
    totalAmount,
    cgst,
    sgst,
    isValid: true,
  };
}
