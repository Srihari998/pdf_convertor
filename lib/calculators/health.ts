import { roundTo } from '../formatters';

export interface BMIResult {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese';
  color: string;
  healthyWeightRange: { minKg: number; maxKg: number };
  interpretation: string;
}

export function calculateBMI(weightKg: number, heightCm: number): BMIResult | null {
  if (weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const bmi = roundTo(weightKg / (heightM * heightM), 1);

  let category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese' = 'Normal weight';
  let color = 'text-green-600';
  let interpretation = 'You have a healthy body weight.';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-amber-500';
    interpretation = 'Your BMI indicates you are underweight.';
  } else if (bmi >= 25 && bmi < 29.9) {
    category = 'Overweight';
    color = 'text-orange-500';
    interpretation = 'Your BMI indicates you are in the overweight range.';
  } else if (bmi >= 30) {
    category = 'Obese';
    color = 'text-red-600';
    interpretation = 'Your BMI falls within the obese range. Consult a healthcare provider.';
  }

  const minKg = roundTo(18.5 * heightM * heightM, 1);
  const maxKg = roundTo(24.9 * heightM * heightM, 1);

  return {
    bmi,
    category,
    color,
    healthyWeightRange: { minKg, maxKg },
    interpretation,
  };
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' = 'sedentary'
) {
  if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) return null;

  // Mifflin-St Jeor Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;
  bmr = Math.round(bmr);

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = Math.round(bmr * (multipliers[activityLevel] || 1.2));

  return {
    bmr,
    tdee,
    mildWeightLoss: Math.round(tdee - 250),
    weightLoss: Math.round(tdee - 500),
    weightGain: Math.round(tdee + 500),
  };
}

export function calculateWaterIntake(weightKg: number, exerciseMinutesPerDay = 30) {
  if (weightKg <= 0) return { litersPerDay: 0, glassesPerDay: 0 };
  // Base: 35ml per kg bodyweight + 350ml per 30 mins exercise
  const baseMl = weightKg * 35;
  const exerciseMl = (exerciseMinutesPerDay / 30) * 350;
  const totalMl = baseMl + exerciseMl;
  const liters = roundTo(totalMl / 1000, 2);
  const glasses = Math.round(totalMl / 250);

  return {
    litersPerDay: liters,
    glassesPerDay: glasses,
    totalMl: Math.round(totalMl),
  };
}

export function calculateIdealWeight(heightCm: number, gender: 'male' | 'female') {
  if (heightCm < 152.4) {
    return { devine: 50, robinson: 49, miller: 53 };
  }
  const inchesOver5Ft = (heightCm - 152.4) / 2.54;
  let devine = 0;
  let robinson = 0;
  let miller = 0;

  if (gender === 'male') {
    devine = 50 + 2.3 * inchesOver5Ft;
    robinson = 52 + 1.9 * inchesOver5Ft;
    miller = 56.2 + 1.41 * inchesOver5Ft;
  } else {
    devine = 45.5 + 2.3 * inchesOver5Ft;
    robinson = 49 + 1.7 * inchesOver5Ft;
    miller = 53.1 + 1.36 * inchesOver5Ft;
  }

  return {
    devine: roundTo(devine, 1),
    robinson: roundTo(robinson, 1),
    miller: roundTo(miller, 1),
  };
}
