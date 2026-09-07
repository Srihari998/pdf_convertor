import { roundTo } from '../formatters';

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  nextBirthdayInDays: number;
  isLeapYearBirth: boolean;
}

export function calculateAge(dobStr: string, targetDateStr?: string): AgeResult | null {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  const target = targetDateStr ? new Date(targetDateStr) : new Date();

  if (isNaN(dob.getTime()) || isNaN(target.getTime()) || target < dob) {
    return null;
  }

  let years = target.getFullYear() - dob.getFullYear();
  let months = target.getMonth() - dob.getMonth();
  let days = target.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month of target
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = target.getTime() - dob.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;

  // Next birthday
  let nextBdayYear = target.getFullYear();
  let nextBday = new Date(nextBdayYear, dob.getMonth(), dob.getDate());
  if (nextBday < target) {
    nextBdayYear += 1;
    nextBday = new Date(nextBdayYear, dob.getMonth(), dob.getDate());
  }
  const nextBdayMs = nextBday.getTime() - target.getTime();
  const nextBirthdayInDays = Math.ceil(nextBdayMs / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    nextBirthdayInDays,
    isLeapYearBirth: isLeapYear(dob.getFullYear()),
  };
}

export function isLeapYear(year: number): boolean {
  if (isNaN(year) || year <= 0) return false;
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function calculateDateDifference(date1Str: string, date2Str: string) {
  const d1 = new Date(date1Str);
  const d2 = new Date(date2Str);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

  const start = d1 < d2 ? d1 : d2;
  const end = d1 < d2 ? d2 : d1;

  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  // Calculate business days (Monday-Friday)
  let businessDays = 0;
  const cur = new Date(start);
  while (cur < end) {
    cur.setDate(cur.getDate() + 1);
    const day = cur.getDay();
    if (day !== 0 && day !== 6) {
      businessDays++;
    }
  }

  return {
    totalDays,
    weeks,
    remainingDays,
    businessDays,
    weekendDays: totalDays - businessDays,
    totalHours: totalDays * 24,
  };
}

export function addSubtractDays(startDateStr: string, days: number, operation: 'add' | 'subtract', skipWeekends = false) {
  const d = new Date(startDateStr);
  if (isNaN(d.getTime())) return null;

  if (!skipWeekends) {
    const delta = operation === 'add' ? days : -days;
    d.setDate(d.getDate() + delta);
    return {
      resultDate: d.toISOString().split('T')[0],
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'long' }),
      formatted: d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
  }

  let added = 0;
  const step = operation === 'add' ? 1 : -1;
  while (added < Math.abs(days)) {
    d.setDate(d.getDate() + step);
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }

  return {
    resultDate: d.toISOString().split('T')[0],
    dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'long' }),
    formatted: d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  };
}

export function getDayOfWeek(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
    formattedDate: d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    isWeekend: d.getDay() === 0 || d.getDay() === 6,
    dayOfYear: Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)),
  };
}

export function calculateTimeDifference(time1Str: string, time2Str: string) {
  // Format HH:MM
  const [h1, m1] = (time1Str || '00:00').split(':').map(Number);
  const [h2, m2] = (time2Str || '00:00').split(':').map(Number);

  let minutes1 = h1 * 60 + m1;
  let minutes2 = h2 * 60 + m2;

  if (minutes2 < minutes1) {
    minutes2 += 24 * 60; // crossed midnight
  }

  const diffMinutes = minutes2 - minutes1;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return {
    hours,
    minutes,
    totalMinutes: diffMinutes,
    totalSeconds: diffMinutes * 60,
    decimalHours: roundTo(diffMinutes / 60, 2),
  };
}
