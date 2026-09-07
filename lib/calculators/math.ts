import { roundTo } from '../formatters';

export function calculatePercentageOf(percent: number, total: number): number {
  return roundTo((percent * total) / 100, 4);
}

export function calculateIsWhatPercentOf(value: number, total: number): number {
  if (total === 0) return 0;
  return roundTo((value / total) * 100, 4);
}

export function calculatePercentageChange(originalVal: number, newVal: number) {
  if (originalVal === 0) {
    return { changePercent: 0, difference: newVal, type: 'increase' as const };
  }
  const difference = newVal - originalVal;
  const changePercent = roundTo((difference / Math.abs(originalVal)) * 100, 2);
  return {
    changePercent: Math.abs(changePercent),
    difference: roundTo(difference, 2),
    type: (difference >= 0 ? 'increase' : 'decrease') as 'increase' | 'decrease',
  };
}

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export function generatePassword(options: PasswordOptions): { password: string; strength: 'weak' | 'medium' | 'strong' | 'very_strong'; entropy: number } {
  let charset = '';
  if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.includeNumbers) charset += '0123456789';
  if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!charset) {
    charset = 'abcdefghijklmnopqrstuvwxyz';
  }

  const length = Math.max(4, Math.min(128, options.length));
  let password = '';

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }

  // Calculate entropy: L * log2(R)
  const entropy = Math.round(length * Math.log2(charset.length));
  let strength: 'weak' | 'medium' | 'strong' | 'very_strong' = 'weak';
  if (entropy >= 80) strength = 'very_strong';
  else if (entropy >= 60) strength = 'strong';
  else if (entropy >= 40) strength = 'medium';

  return { password, strength, entropy };
}

export function generateRandomNumber(min: number, max: number, count = 1): number[] {
  const result: number[] = [];
  const safeCount = Math.min(Math.max(1, count), 100);
  const actualMin = Math.min(min, max);
  const actualMax = Math.max(min, max);
  const range = actualMax - actualMin + 1;

  for (let i = 0; i < safeCount; i++) {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      result.push(actualMin + (arr[0] % range));
    } else {
      result.push(Math.floor(Math.random() * range) + actualMin);
    }
  }
  return result;
}

export function calculateTip(billAmount: number, tipPercentage: number, numberOfPeople = 1) {
  if (billAmount <= 0) return { tipAmount: 0, totalBill: 0, perPersonTotal: 0, perPersonTip: 0 };
  const safePeople = Math.max(1, numberOfPeople);
  const tipAmount = roundTo((billAmount * tipPercentage) / 100, 2);
  const totalBill = roundTo(billAmount + tipAmount, 2);
  const perPersonTotal = roundTo(totalBill / safePeople, 2);
  const perPersonTip = roundTo(tipAmount / safePeople, 2);

  return {
    tipAmount,
    totalBill,
    perPersonTotal,
    perPersonTip,
  };
}

export function fractionToDecimal(numerator: number, denominator: number) {
  if (denominator === 0) return { decimal: 0, simplified: 'Undefined' };
  const decimal = roundTo(numerator / denominator, 6);
  const gcdVal = gcd(Math.abs(numerator), Math.abs(denominator));
  const simNum = numerator / gcdVal;
  const simDen = denominator / gcdVal;
  return {
    decimal,
    simplified: `${simNum}/${simDen}`,
  };
}

export function decimalToFraction(decimal: number) {
  if (isNaN(decimal)) return { fraction: '0/1' };
  const len = (decimal.toString().split('.')[1] || '').length;
  const denominator = Math.pow(10, len);
  const numerator = Math.round(decimal * denominator);
  const gcdVal = gcd(Math.abs(numerator), denominator);
  return {
    fraction: `${numerator / gcdVal}/${denominator / gcdVal}`,
    numerator: numerator / gcdVal,
    denominator: denominator / gcdVal,
  };
}

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a * b)) / gcd(a, b);
}

export function calculateStats(numbers: number[]) {
  if (!numbers.length) return null;
  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = roundTo(sum / sorted.length, 4);

  // Median
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : roundTo((sorted[mid - 1] + sorted[mid]) / 2, 4);

  // Mode
  const frequency: Record<number, number> = {};
  let maxFreq = 0;
  for (const n of sorted) {
    frequency[n] = (frequency[n] || 0) + 1;
    if (frequency[n] > maxFreq) maxFreq = frequency[n];
  }
  const modes = Object.keys(frequency)
    .filter((k) => frequency[Number(k)] === maxFreq)
    .map(Number);

  // Variance & Standard Deviation
  const variance = roundTo(
    sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / sorted.length,
    4
  );
  const stdDev = roundTo(Math.sqrt(variance), 4);

  return {
    count: sorted.length,
    sum: roundTo(sum, 2),
    mean,
    median,
    modes: modes.length === sorted.length ? [] : modes,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    range: roundTo(sorted[sorted.length - 1] - sorted[0], 2),
    variance,
    stdDev,
  };
}

export function solveRatio(a: number, b: number, c: number) {
  // A : B = C : X => X = (B * C) / A
  if (a === 0) return 0;
  return roundTo((b * c) / a, 4);
}

export function calculateAspectRatio(w1: number, h1: number, newDim: { width?: number; height?: number }) {
  if (w1 <= 0 || h1 <= 0) return { width: 0, height: 0, ratioString: '1:1' };
  const gcdVal = gcd(w1, h1);
  const ratioString = `${w1 / gcdVal}:${h1 / gcdVal}`;

  if (newDim.width && newDim.width > 0) {
    return {
      width: newDim.width,
      height: roundTo((newDim.width * h1) / w1, 2),
      ratioString,
    };
  } else if (newDim.height && newDim.height > 0) {
    return {
      width: roundTo((newDim.height * w1) / h1, 2),
      height: newDim.height,
      ratioString,
    };
  }
  return { width: w1, height: h1, ratioString };
}
