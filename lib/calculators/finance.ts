import { roundTo } from '../formatters';

export interface EMIResult {
  monthlyEMI: number;
  totalPayment: number;
  totalInterest: number;
  principalAmount: number;
  amortizationSchedule: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    balance: number;
  }[];
}

export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureYears: number,
  tenureMonths = 0
): EMIResult {
  const totalMonths = tenureYears * 12 + tenureMonths;
  if (principal <= 0 || totalMonths <= 0) {
    return {
      monthlyEMI: 0,
      totalPayment: 0,
      totalInterest: 0,
      principalAmount: principal,
      amortizationSchedule: [],
    };
  }

  if (annualInterestRate <= 0) {
    const monthlyEMI = roundTo(principal / totalMonths, 2);
    return {
      monthlyEMI,
      totalPayment: principal,
      totalInterest: 0,
      principalAmount: principal,
      amortizationSchedule: [],
    };
  }

  // Monthly interest rate
  const r = annualInterestRate / 12 / 100;
  const n = totalMonths;

  // Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
  const factor = Math.pow(1 + r, n);
  const monthlyEMI = roundTo((principal * r * factor) / (factor - 1), 2);
  const totalPayment = roundTo(monthlyEMI * n, 2);
  const totalInterest = roundTo(totalPayment - principal, 2);

  // Build yearly amortization schedule
  const amortizationSchedule = [];
  let balance = principal;
  const numYears = Math.ceil(n / 12);

  for (let y = 1; y <= numYears; y++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    const monthsInThisYear = Math.min(12, n - (y - 1) * 12);

    for (let m = 0; m < monthsInThisYear; m++) {
      const monthInterest = balance * r;
      const monthPrincipal = monthlyEMI - monthInterest;
      yearInterest += monthInterest;
      yearPrincipal += monthPrincipal;
      balance = Math.max(0, balance - monthPrincipal);
    }

    amortizationSchedule.push({
      year: y,
      principalPaid: roundTo(yearPrincipal, 2),
      interestPaid: roundTo(yearInterest, 2),
      balance: roundTo(balance, 2),
    });
  }

  return {
    monthlyEMI,
    totalPayment,
    totalInterest,
    principalAmount: principal,
    amortizationSchedule,
  };
}

export interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  breakdown: {
    year: number;
    invested: number;
    futureValue: number;
  }[];
}

export function calculateSIP(
  monthlyInvestment: number,
  expectedAnnualReturn: number,
  durationYears: number
): SIPResult {
  const months = durationYears * 12;
  if (monthlyInvestment <= 0 || durationYears <= 0) {
    return { investedAmount: 0, estimatedReturns: 0, totalValue: 0, breakdown: [] };
  }

  const investedAmount = monthlyInvestment * months;

  if (expectedAnnualReturn <= 0) {
    return {
      investedAmount,
      estimatedReturns: 0,
      totalValue: investedAmount,
      breakdown: [],
    };
  }

  const i = expectedAnnualReturn / 12 / 100;
  // Formula: M = P * [ (1 + i)^n - 1 ] * (1 + i) / i
  const totalValue = roundTo(
    (monthlyInvestment * (Math.pow(1 + i, months) - 1) * (1 + i)) / i,
    2
  );
  const estimatedReturns = roundTo(totalValue - investedAmount, 2);

  const breakdown = [];
  for (let y = 1; y <= durationYears; y++) {
    const m = y * 12;
    const fv = roundTo((monthlyInvestment * (Math.pow(1 + i, m) - 1) * (1 + i)) / i, 2);
    breakdown.push({
      year: y,
      invested: monthlyInvestment * m,
      futureValue: fv,
    });
  }

  return {
    investedAmount,
    estimatedReturns,
    totalValue,
    breakdown,
  };
}

export function calculateGST(amount: number, gstRate: number, mode: 'add' | 'remove') {
  if (amount <= 0 || gstRate <= 0) {
    return {
      baseAmount: amount,
      gstAmount: 0,
      finalAmount: amount,
      cgst: 0,
      sgst: 0,
    };
  }

  if (mode === 'add') {
    const gstAmount = roundTo((amount * gstRate) / 100, 2);
    const finalAmount = roundTo(amount + gstAmount, 2);
    return {
      baseAmount: amount,
      gstAmount,
      finalAmount,
      cgst: roundTo(gstAmount / 2, 2),
      sgst: roundTo(gstAmount / 2, 2),
    };
  } else {
    // Removing GST: Final Amount = amount, Base = amount / (1 + rate/100)
    const baseAmount = roundTo(amount / (1 + gstRate / 100), 2);
    const gstAmount = roundTo(amount - baseAmount, 2);
    return {
      baseAmount,
      gstAmount,
      finalAmount: amount,
      cgst: roundTo(gstAmount / 2, 2),
      sgst: roundTo(gstAmount / 2, 2),
    };
  }
}

export function calculateDiscount(originalPrice: number, discountPercent: number) {
  if (originalPrice <= 0 || discountPercent <= 0) {
    return {
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      savings: 0,
    };
  }
  const discountAmount = roundTo((originalPrice * Math.min(100, discountPercent)) / 100, 2);
  const finalPrice = roundTo(originalPrice - discountAmount, 2);
  return {
    originalPrice,
    discountAmount,
    finalPrice,
    savings: discountAmount,
  };
}

export function calculateCompoundInterest(
  principal: number,
  rate: number,
  timeYears: number,
  compoundingFrequency = 1 // 1=annual, 4=quarterly, 12=monthly
) {
  if (principal <= 0 || timeYears <= 0) {
    return { principal, totalInterest: 0, totalAmount: principal };
  }
  const r = rate / 100;
  const n = compoundingFrequency;
  const totalAmount = roundTo(principal * Math.pow(1 + r / n, n * timeYears), 2);
  const totalInterest = roundTo(totalAmount - principal, 2);
  return {
    principal,
    totalInterest,
    totalAmount,
  };
}

export function calculateSimpleInterest(principal: number, rate: number, timeYears: number) {
  if (principal <= 0 || timeYears <= 0) {
    return { principal, totalInterest: 0, totalAmount: principal };
  }
  const totalInterest = roundTo((principal * rate * timeYears) / 100, 2);
  const totalAmount = roundTo(principal + totalInterest, 2);
  return {
    principal,
    totalInterest,
    totalAmount,
  };
}

export function calculateSalaryCTC(annualCTC: number, customMonthlyDeduction = 0) {
  if (annualCTC <= 0) {
    return {
      annualCTC: 0,
      monthlyCTC: 0,
      estimatedInHandMonthly: 0,
      estimatedInHandAnnual: 0,
      monthlyPF: 0,
      monthlyTaxEstimate: 0,
      otherDeductions: 0,
    };
  }

  const monthlyCTC = roundTo(annualCTC / 12, 2);
  // Estimated breakdown (standard Indian corporate model benchmark)
  const basicSalaryMonthly = monthlyCTC * 0.40;
  const monthlyPF = Math.min(basicSalaryMonthly * 0.12, 1800); // PF employee share estimate
  const professionalTax = 200; // standard benchmark
  
  // Rough income tax estimate for display purposes
  let annualTaxEstimate = 0;
  if (annualCTC > 700000) {
    annualTaxEstimate = (annualCTC - 700000) * 0.15;
  }
  const monthlyTax = annualTaxEstimate / 12;

  const totalMonthlyDeductions = monthlyPF + professionalTax + monthlyTax + customMonthlyDeduction;
  const estimatedInHandMonthly = Math.max(0, roundTo(monthlyCTC - totalMonthlyDeductions, 2));

  return {
    annualCTC,
    monthlyCTC,
    estimatedInHandMonthly,
    estimatedInHandAnnual: roundTo(estimatedInHandMonthly * 12, 2),
    monthlyPF: roundTo(monthlyPF, 2),
    monthlyTaxEstimate: roundTo(monthlyTax, 2),
    otherDeductions: customMonthlyDeduction + professionalTax,
  };
}

export function calculateSalaryHike(currentSalary: number, hikePercentage: number) {
  if (currentSalary <= 0) {
    return {
      currentSalary: 0,
      hikePercentage: 0,
      hikeAmount: 0,
      newSalary: 0,
      monthlyCurrent: 0,
      monthlyNew: 0,
      monthlyDifference: 0,
    };
  }
  const hikeAmount = roundTo((currentSalary * hikePercentage) / 100, 2);
  const newSalary = roundTo(currentSalary + hikeAmount, 2);
  const monthlyCurrent = roundTo(currentSalary / 12, 2);
  const monthlyNew = roundTo(newSalary / 12, 2);
  const monthlyDifference = roundTo(monthlyNew - monthlyCurrent, 2);

  return {
    currentSalary,
    hikePercentage,
    hikeAmount,
    newSalary,
    monthlyCurrent,
    monthlyNew,
    monthlyDifference,
  };
}

export function calculateInflation(presentAmount: number, inflationRate: number, years: number) {
  if (presentAmount <= 0 || years <= 0) {
    return { presentAmount, futureAmount: presentAmount, lossOfValue: 0 };
  }
  const futureAmount = roundTo(presentAmount * Math.pow(1 + inflationRate / 100, years), 2);
  return {
    presentAmount,
    futureAmount,
    lossOfValue: roundTo(futureAmount - presentAmount, 2),
  };
}

export function calculateCAGR(initialValue: number, finalValue: number, years: number) {
  if (initialValue <= 0 || finalValue <= 0 || years <= 0) {
    return { cagr: 0, absoluteReturn: 0 };
  }
  const cagr = roundTo((Math.pow(finalValue / initialValue, 1 / years) - 1) * 100, 2);
  const absoluteReturn = roundTo(((finalValue - initialValue) / initialValue) * 100, 2);
  return { cagr, absoluteReturn };
}

export function calculateLumpSum(investment: number, annualRate: number, years: number) {
  if (investment <= 0 || years <= 0) {
    return { investment, totalReturns: 0, totalValue: investment };
  }
  const totalValue = roundTo(investment * Math.pow(1 + annualRate / 100, years), 2);
  const totalReturns = roundTo(totalValue - investment, 2);
  return { investment, totalReturns, totalValue };
}

export function calculateFD(principal: number, interestRate: number, tenureYears: number) {
  // Quarterly compounding standard for Fixed Deposits
  return calculateCompoundInterest(principal, interestRate, tenureYears, 4);
}

export function calculateRD(monthlyDeposit: number, annualRate: number, tenureMonths: number) {
  if (monthlyDeposit <= 0 || tenureMonths <= 0) {
    return { totalInvested: 0, interestEarned: 0, maturityAmount: 0 };
  }
  const totalInvested = monthlyDeposit * tenureMonths;
  const i = annualRate / 400; // quarterly compounding
  const n = tenureMonths / 3; // number of quarters
  
  // RD formula: M = P * ((1+i)^n - 1) / (1 - (1+i)^(-1/3))
  const maturityAmount = roundTo(
    monthlyDeposit * ((Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1 / 3))),
    2
  );
  const interestEarned = roundTo(maturityAmount - totalInvested, 2);

  return {
    totalInvested,
    interestEarned,
    maturityAmount,
  };
}

export function calculatePPF(yearlyDeposit: number, annualRate = 7.1, durationYears = 15) {
  let totalInvested = 0;
  let balance = 0;
  const breakdown = [];

  for (let y = 1; y <= durationYears; y++) {
    totalInvested += yearlyDeposit;
    balance += yearlyDeposit;
    const interest = balance * (annualRate / 100);
    balance += interest;

    breakdown.push({
      year: y,
      invested: totalInvested,
      interest: roundTo(interest, 2),
      balance: roundTo(balance, 2),
    });
  }

  return {
    totalInvested,
    totalInterest: roundTo(balance - totalInvested, 2),
    maturityAmount: roundTo(balance, 2),
    breakdown,
  };
}

export function calculateROI(initialInvestment: number, finalReturn: number, investmentDurationYears = 1) {
  if (initialInvestment <= 0) return { roi: 0, annualizedROI: 0, netProfit: 0 };
  const netProfit = roundTo(finalReturn - initialInvestment, 2);
  const roi = roundTo((netProfit / initialInvestment) * 100, 2);
  const annualizedROI = investmentDurationYears > 0 ? roundTo(roi / investmentDurationYears, 2) : roi;
  return { roi, annualizedROI, netProfit };
}

export function calculateRuleOf72(annualInterestRate: number) {
  if (annualInterestRate <= 0) return { yearsToDouble: 0 };
  return { yearsToDouble: roundTo(72 / annualInterestRate, 1) };
}

export function calculateHomeLoanEligibility(monthlyGrossIncome: number, existingMonthlyEMIs = 0, interestRate = 8.5, tenureYears = 20) {
  if (monthlyGrossIncome <= 0) return { eligibleLoanAmount: 0, maxEMI: 0 };
  // 50% FOIR (Fixed Obligation to Income Ratio)
  const maxAllowableEMI = Math.max(0, monthlyGrossIncome * 0.50 - existingMonthlyEMIs);
  
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;
  const factor = Math.pow(1 + r, n);
  
  // P = E * (factor - 1) / (r * factor)
  const eligibleLoanAmount = roundTo((maxAllowableEMI * (factor - 1)) / (r * factor), 0);

  return {
    eligibleLoanAmount,
    maxEMI: roundTo(maxAllowableEMI, 2),
  };
}
