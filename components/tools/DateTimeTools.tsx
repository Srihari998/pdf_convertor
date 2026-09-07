'use client';

import React, { useState } from 'react';
import {
  calculateAge,
  calculateDateDifference,
  addSubtractDays,
  getDayOfWeek,
  calculateTimeDifference,
  isLeapYear,
} from '../../lib/calculators/datetime';
import { ResultCard } from '../common/ResultCard';
import { InputField } from '../common/InputField';
import { Cake, Sparkles } from 'lucide-react';

export function AgeCalculatorWidget() {
  const [dob, setDob] = useState('2000-08-15');
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);

  const res = calculateAge(dob, targetDate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="age-dob"
          label="Date of Birth"
          type="date"
          value={dob}
          onChange={setDob}
        />
        <InputField
          id="age-target"
          label="Age at the Date of"
          type="date"
          value={targetDate}
          onChange={setTargetDate}
        />
      </div>

      {res && (
        <>
          <ResultCard
            title="Chronological Age"
            primaryLabel="Exact Age"
            primaryValue={`${res.years} Years, ${res.months} Months, ${res.days} Days`}
            badge={{
              text: `Next Birthday in ${res.nextBirthdayInDays} days`,
              variant: 'info',
            }}
            breakdown={[
              { label: 'Total Months', value: res.totalMonths },
              { label: 'Total Weeks', value: res.totalWeeks.toLocaleString() },
              { label: 'Total Days', value: res.totalDays.toLocaleString() },
              { label: 'Total Hours', value: res.totalHours.toLocaleString() },
            ]}
          />

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <Cake className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Next Birthday Countdown:</strong> {res.nextBirthdayInDays} days remaining!
              </span>
            </div>
            {res.isLeapYearBirth && (
              <span className="text-[11px] font-semibold bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded-full">
                Born in Leap Year
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function DateDifferenceWidget() {
  const [d1, setD1] = useState('2026-01-01');
  const [d2, setD2] = useState('2026-12-31');

  const res = calculateDateDifference(d1, d2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField id="dd-start" label="Start Date" type="date" value={d1} onChange={setD1} />
        <InputField id="dd-end" label="End Date" type="date" value={d2} onChange={setD2} />
      </div>

      {res && (
        <ResultCard
          title="Date Difference"
          primaryLabel="Total Duration"
          primaryValue={res.totalDays}
          primaryUnit={res.totalDays === 1 ? 'Calendar Day' : 'Calendar Days'}
          breakdown={[
            { label: 'Working / Business Days', value: `${res.businessDays} days`, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Weekend Days', value: `${res.weekendDays} days` },
            { label: 'Weeks & Days', value: `${res.weeks} wks, ${res.remainingDays} days` },
            { label: 'Total Hours', value: `${res.totalHours} hrs` },
          ]}
        />
      )}
    </div>
  );
}

export function AddSubtractDaysWidget() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState('30');
  const [op, setOp] = useState<'add' | 'subtract'>('add');
  const [skipWeekends, setSkipWeekends] = useState(false);

  const res = addSubtractDays(date, parseInt(days, 10) || 0, op, skipWeekends);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="asd-date" label="Starting Date" type="date" value={date} onChange={setDate} />
        <InputField id="asd-days" label="Number of Days" type="number" value={days} onChange={setDays} />
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Operation</label>
          <select
            value={op}
            onChange={(e) => setOp(e.target.value as 'add' | 'subtract')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-3 text-sm font-medium"
          >
            <option value="add">Add Days (+)</option>
            <option value="subtract">Subtract Days (-)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="skip-wk"
          type="checkbox"
          checked={skipWeekends}
          onChange={(e) => setSkipWeekends(e.target.checked)}
          className="rounded accent-blue-600"
        />
        <label htmlFor="skip-wk" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          Count only Working Business Days (Skip Saturdays & Sundays)
        </label>
      </div>

      {res && (
        <ResultCard
          title="Calculated Date"
          primaryLabel="Target Calendar Date"
          primaryValue={res.formatted}
          breakdown={[
            { label: 'Day of the Week', value: res.dayOfWeek },
            { label: 'ISO Format', value: res.resultDate },
          ]}
        />
      )}
    </div>
  );
}

export function TimeDifferenceWidget() {
  const [t1, setT1] = useState('09:30');
  const [t2, setT2] = useState('17:45');

  const res = calculateTimeDifference(t1, t2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField id="td-start" label="Start Time" type="time" value={t1} onChange={setT1} />
        <InputField id="td-end" label="End Time" type="time" value={t2} onChange={setT2} />
      </div>

      <ResultCard
        title="Time Elapsed"
        primaryLabel="Total Duration"
        primaryValue={`${res.hours} Hours, ${res.minutes} Minutes`}
        breakdown={[
          { label: 'Decimal Hours', value: `${res.decimalHours} hrs` },
          { label: 'Total Minutes', value: `${res.totalMinutes} min` },
          { label: 'Total Seconds', value: `${res.totalSeconds} sec` },
        ]}
      />
    </div>
  );
}

export function LeapYearWidget() {
  const [year, setYear] = useState('2024');
  const yrNum = parseInt(year, 10) || 0;
  const isLeap = isLeapYear(yrNum);

  return (
    <div className="space-y-6">
      <InputField id="ly-yr" label="Enter Year (e.g. 2024, 2026, 2028)" type="number" value={year} onChange={setYear} />

      <ResultCard
        title="Leap Year Verification"
        primaryLabel={`Year ${yrNum}`}
        primaryValue={isLeap ? 'Is a Leap Year (366 Days)' : 'Is a Common Year (365 Days)'}
        badge={{
          text: isLeap ? 'Has February 29' : 'February has 28 Days',
          variant: isLeap ? 'success' : 'info',
        }}
        breakdown={[
          { label: 'Divisible by 4', value: yrNum % 4 === 0 ? 'Yes' : 'No' },
          { label: 'Divisible by 100', value: yrNum % 100 === 0 ? 'Yes' : 'No' },
          { label: 'Divisible by 400', value: yrNum % 400 === 0 ? 'Yes' : 'No' },
        ]}
      />
    </div>
  );
}

export function DayOfWeekWidget() {
  const [date, setDate] = useState('1947-08-15');
  const res = getDayOfWeek(date);

  return (
    <div className="space-y-6">
      <InputField id="dow-date" label="Pick or Enter Date" type="date" value={date} onChange={setDate} />

      {res && (
        <ResultCard
          title="Day of Week Result"
          primaryLabel="Day of the Week"
          primaryValue={res.weekday}
          badge={{ text: res.isWeekend ? 'Weekend' : 'Weekday', variant: res.isWeekend ? 'warning' : 'info' }}
          breakdown={[
            { label: 'Formatted Date', value: res.formattedDate },
            { label: 'Day of the Year', value: `Day #${res.dayOfYear}` },
          ]}
        />
      )}
    </div>
  );
}
