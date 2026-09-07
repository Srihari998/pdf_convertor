'use client';

import React, { useState } from 'react';
import {
  calculateBMI,
  calculateBMR,
  calculateWaterIntake,
  calculateIdealWeight,
} from '../../lib/calculators/health';
import { InputField } from '../common/InputField';
import { ResultCard } from '../common/ResultCard';

export function BMIWidget() {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');

  const res = calculateBMI(parseFloat(weight) || 0, parseFloat(height) || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField id="bmi-w" label="Body Weight (kg)" type="number" unit="kg" value={weight} onChange={setWeight} placeholder="70" />
        <InputField id="bmi-h" label="Height (cm)" type="number" unit="cm" value={height} onChange={setHeight} placeholder="175" />
      </div>

      {res && (
        <ResultCard
          title="Body Mass Index (BMI)"
          primaryLabel="Your Calculated BMI"
          primaryValue={res.bmi}
          primaryUnit="kg/m²"
          badge={{
            text: res.category,
            variant: res.category === 'Normal weight' ? 'success' : res.category === 'Underweight' ? 'warning' : 'danger',
          }}
          breakdown={[
            { label: 'WHO Classification', value: res.category },
            { label: 'Healthy Weight Range', value: `${res.healthyWeightRange.minKg} - ${res.healthyWeightRange.maxKg} kg` },
          ]}
        />
      )}
    </div>
  );
}

export function CalorieBMRWidget() {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>('moderate');

  const res = calculateBMR(
    parseFloat(weight) || 0,
    parseFloat(height) || 0,
    parseInt(age, 10) || 0,
    gender,
    activity
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="bmr-w" label="Weight (kg)" type="number" value={weight} onChange={setWeight} />
        <InputField id="bmr-h" label="Height (cm)" type="number" value={height} onChange={setHeight} />
        <InputField id="bmr-a" label="Age (Years)" type="number" value={age} onChange={setAge} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as 'male' | 'female')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-3 text-sm font-medium"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value as any)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-3 text-sm font-medium"
          >
            <option value="sedentary">Sedentary (Little/No Exercise)</option>
            <option value="light">Light (Exercise 1-3 days/wk)</option>
            <option value="moderate">Moderate (Exercise 3-5 days/wk)</option>
            <option value="active">Active (Hard exercise 6-7 days/wk)</option>
            <option value="very_active">Very Active (Intense training)</option>
          </select>
        </div>
      </div>

      {res && (
        <ResultCard
          title="Daily Caloric Needs (TDEE)"
          primaryLabel="Maintenance Calories"
          primaryValue={res.tdee}
          primaryUnit="kcal / day"
          breakdown={[
            { label: 'Basal Metabolic Rate (BMR)', value: `${res.bmr} kcal` },
            { label: 'Weight Loss (-500 kcal)', value: `${res.weightLoss} kcal`, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Weight Gain (+500 kcal)', value: `${res.weightGain} kcal`, color: 'text-blue-600 dark:text-blue-400' },
          ]}
        />
      )}
    </div>
  );
}

export function WaterIntakeWidget() {
  const [weight, setWeight] = useState('68');
  const [exercise, setExercise] = useState('45');

  const res = calculateWaterIntake(parseFloat(weight) || 0, parseInt(exercise, 10) || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField id="water-w" label="Body Weight (kg)" type="number" unit="kg" value={weight} onChange={setWeight} />
        <InputField id="water-ex" label="Daily Workout / Exercise (Minutes)" type="number" unit="mins" value={exercise} onChange={setExercise} />
      </div>

      <ResultCard
        title="Hydration Recommendation"
        primaryLabel="Daily Recommended Water"
        primaryValue={res.litersPerDay}
        primaryUnit="Liters / day"
        badge={{ text: `Approx. ${res.glassesPerDay} Standard Glasses`, variant: 'info' }}
        breakdown={[
          { label: 'Total Volume', value: `${res.totalMl} mL` },
          { label: 'Standard 250ml Glasses', value: `${res.glassesPerDay} glasses` },
        ]}
      />
    </div>
  );
}

export function IdealWeightWidget() {
  const [height, setHeight] = useState('175');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const res = calculateIdealWeight(parseFloat(height) || 170, gender);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField id="iw-h" label="Height (cm)" type="number" unit="cm" value={height} onChange={setHeight} />
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as 'male' | 'female')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-3 text-sm font-medium"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <ResultCard
        title="Ideal Body Weight Estimates"
        primaryLabel="Devine Medical Benchmark"
        primaryValue={res.devine}
        primaryUnit="kg"
        breakdown={[
          { label: 'Robinson Formula', value: `${res.robinson} kg` },
          { label: 'Miller Formula', value: `${res.miller} kg` },
        ]}
      />
    </div>
  );
}
