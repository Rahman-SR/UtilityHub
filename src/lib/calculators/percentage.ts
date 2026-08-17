export type PercentageMode = 'percentage_of' | 'is_what_percent' | 'percentage_change';

export interface PercentageInput {
  mode: PercentageMode;
  value1: number; // e.g. X in "X% of Y", or Old Value in Change
  value2: number; // e.g. Y in "X% of Y", or New Value in Change
}

export interface PercentageResult {
  resultValue: number;
  displayText: string;
  changeType?: 'increase' | 'decrease' | 'no_change';
  isValid: boolean;
  error?: string;
}

export function calculatePercentage(input: PercentageInput): PercentageResult {
  const { mode, value1, value2 } = input;

  if (isNaN(value1) || isNaN(value2)) {
    return {
      resultValue: 0,
      displayText: '0',
      isValid: false,
      error: 'Please enter valid numeric values.',
    };
  }

  if (mode === 'percentage_of') {
    // Mode 1: What is X% of Y?
    // Formula: (X / 100) * Y
    const resultValue = (value1 / 100) * value2;
    return {
      resultValue,
      displayText: `${value1}% of ${value2} is ${Number(resultValue.toFixed(4))}`,
      isValid: true,
    };
  }

  if (mode === 'is_what_percent') {
    // Mode 2: X is what percentage of Y?
    // Formula: (X / Y) * 100
    if (value2 === 0) {
      return {
        resultValue: 0,
        displayText: 'Division by zero is undefined',
        isValid: false,
        error: 'Denominator Y cannot be zero.',
      };
    }
    const resultValue = (value1 / value2) * 100;
    return {
      resultValue,
      displayText: `${value1} is ${Number(resultValue.toFixed(2))}% of ${value2}`,
      isValid: true,
    };
  }

  if (mode === 'percentage_change') {
    // Mode 3: Percentage change from Old Value (value1) to New Value (value2)
    // Formula: ((New - Old) / Old) * 100
    if (value1 === 0) {
      return {
        resultValue: 0,
        displayText: 'Percentage change from 0 is undefined',
        isValid: false,
        error: 'Initial Old Value cannot be zero.',
      };
    }

    const diff = value2 - value1;
    const resultValue = (diff / Math.abs(value1)) * 100;
    let changeType: 'increase' | 'decrease' | 'no_change' = 'no_change';

    if (resultValue > 0) changeType = 'increase';
    if (resultValue < 0) changeType = 'decrease';

    const absPercent = Math.abs(resultValue);
    const text =
      changeType === 'increase'
        ? `Increased by ${Number(absPercent.toFixed(2))}%`
        : changeType === 'decrease'
        ? `Decreased by ${Number(absPercent.toFixed(2))}%`
        : 'No percentage change (0%)';

    return {
      resultValue,
      displayText: text,
      changeType,
      isValid: true,
    };
  }

  return {
    resultValue: 0,
    displayText: '0',
    isValid: false,
    error: 'Invalid calculation mode selected.',
  };
}
