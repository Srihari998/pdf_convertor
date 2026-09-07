import { roundTo } from '../formatters';

export interface AttendanceResult {
  currentPercentage: number;
  status: 'safe' | 'warning' | 'critical';
  statusText: string;
}

export function calculateAttendance(attended: number, total: number): AttendanceResult {
  if (total <= 0) {
    return { currentPercentage: 0, status: 'warning', statusText: 'Total classes must be greater than 0' };
  }
  if (attended < 0) attended = 0;
  if (attended > total) attended = total;

  const percentage = roundTo((attended / total) * 100, 2);
  let status: 'safe' | 'warning' | 'critical' = 'safe';
  let statusText = 'Excellent attendance!';

  if (percentage < 65) {
    status = 'critical';
    statusText = 'Critical shortage — you may be barred from exams!';
  } else if (percentage < 75) {
    status = 'warning';
    statusText = 'Below standard 75% threshold — attendance improvement needed.';
  }

  return {
    currentPercentage: percentage,
    status,
    statusText,
  };
}

export interface ClassesCanMissResult {
  currentPercentage: number;
  canMissCount: number;
  status: 'can_miss' | 'cannot_miss' | 'already_low';
  message: string;
  projectedTable: {
    missedClasses: number;
    totalClasses: number;
    projectedPercentage: number;
    isSafe: boolean;
  }[];
}

export function calculateClassesCanMiss(
  attended: number,
  total: number,
  targetPercentage = 75
): ClassesCanMissResult {
  if (total <= 0 || targetPercentage <= 0 || targetPercentage > 100) {
    return {
      currentPercentage: 0,
      canMissCount: 0,
      status: 'cannot_miss',
      message: 'Please enter valid positive numbers with a target percentage between 1% and 100%.',
      projectedTable: [],
    };
  }

  if (attended > total) attended = total;
  if (attended < 0) attended = 0;

  const currentPercentage = roundTo((attended / total) * 100, 2);

  if (currentPercentage < targetPercentage) {
    return {
      currentPercentage,
      canMissCount: 0,
      status: 'already_low',
      message: `Your current attendance (${currentPercentage}%) is already below your target (${targetPercentage}%). You cannot afford to miss any classes.`,
      projectedTable: [
        {
          missedClasses: 0,
          totalClasses: total,
          projectedPercentage: currentPercentage,
          isSafe: false,
        },
      ],
    };
  }

  // Formula: attended / (total + X) >= target / 100
  // => total + X <= (attended * 100) / target
  // => X <= (attended * 100 / target) - total
  const rawMiss = (attended * 100) / targetPercentage - total;
  const canMissCount = Math.max(0, Math.floor(rawMiss + 1e-9));

  // Build projected simulation table
  const projectedTable = [];
  const maxSim = Math.min(canMissCount + 5, 20);

  for (let i = 0; i <= maxSim; i++) {
    const projectedTotal = total + i;
    const projPct = roundTo((attended / projectedTotal) * 100, 2);
    projectedTable.push({
      missedClasses: i,
      totalClasses: projectedTotal,
      projectedPercentage: projPct,
      isSafe: projPct >= targetPercentage,
    });
  }

  return {
    currentPercentage,
    canMissCount,
    status: canMissCount > 0 ? 'can_miss' : 'cannot_miss',
    message:
      canMissCount > 0
        ? `You can safely miss up to ${canMissCount} more class${canMissCount > 1 ? 'es' : ''} and still maintain at least ${targetPercentage}% attendance.`
        : `You are exactly at your target limit. Missing even 1 more class will drop your attendance below ${targetPercentage}%.`,
    projectedTable,
  };
}

export interface ClassesNeededResult {
  currentPercentage: number;
  neededCount: number;
  status: 'needed' | 'already_achieved' | 'impossible';
  message: string;
  projectedTable: {
    attendedConsecutive: number;
    totalClasses: number;
    projectedPercentage: number;
    achieved: boolean;
  }[];
}

export function calculateClassesNeeded(
  attended: number,
  total: number,
  targetPercentage = 75
): ClassesNeededResult {
  if (total <= 0 || targetPercentage <= 0 || targetPercentage > 100) {
    return {
      currentPercentage: 0,
      neededCount: 0,
      status: 'impossible',
      message: 'Please enter valid positive numbers with target percentage between 1% and 100%.',
      projectedTable: [],
    };
  }

  if (attended > total) attended = total;
  if (attended < 0) attended = 0;

  const currentPercentage = roundTo((attended / total) * 100, 2);

  if (currentPercentage >= targetPercentage) {
    return {
      currentPercentage,
      neededCount: 0,
      status: 'already_achieved',
      message: `Your current attendance (${currentPercentage}%) already meets or exceeds your target of ${targetPercentage}%.`,
      projectedTable: [
        {
          attendedConsecutive: 0,
          totalClasses: total,
          projectedPercentage: currentPercentage,
          achieved: true,
        },
      ],
    };
  }

  if (targetPercentage >= 100 && attended < total) {
    return {
      currentPercentage,
      neededCount: -1,
      status: 'impossible',
      message: 'It is mathematically impossible to reach 100% attendance because you have already missed at least one class.',
      projectedTable: [],
    };
  }

  // Formula: (attended + X) / (total + X) >= target / 100
  // (100 - target) * X >= target * total - 100 * attended
  // X = Math.ceil((target * total - 100 * attended) / (100 - target))
  const numerator = targetPercentage * total - 100 * attended;
  const denominator = 100 - targetPercentage;
  const neededCount = Math.ceil(numerator / denominator);

  const projectedTable = [];
  const maxSim = Math.min(neededCount + 3, 20);

  for (let i = 1; i <= maxSim; i++) {
    const projAttended = attended + i;
    const projTotal = total + i;
    const projPct = roundTo((projAttended / projTotal) * 100, 2);
    projectedTable.push({
      attendedConsecutive: i,
      totalClasses: projTotal,
      projectedPercentage: projPct,
      achieved: projPct >= targetPercentage,
    });
  }

  return {
    currentPercentage,
    neededCount,
    status: 'needed',
    message: `You must attend the next ${neededCount} consecutive class${neededCount > 1 ? 'es' : ''} to reach ${targetPercentage}% attendance.`,
    projectedTable,
  };
}

export function calculateWhatIfAttendance(
  attended: number,
  total: number,
  additionalAttend: number,
  additionalMiss: number
) {
  const newAttended = Math.max(0, attended + additionalAttend);
  const newTotal = Math.max(1, total + additionalAttend + additionalMiss);
  const currentPercentage = roundTo((attended / Math.max(1, total)) * 100, 2);
  const newPercentage = roundTo((newAttended / newTotal) * 100, 2);
  const difference = roundTo(newPercentage - currentPercentage, 2);

  return {
    currentPercentage,
    newAttended,
    newTotal,
    newPercentage,
    difference,
  };
}

export function calculateMarksPercentage(obtained: number, total: number) {
  if (total <= 0) return { percentage: 0, grade: 'N/A', status: 'Invalid total' };
  const pct = roundTo((obtained / total) * 100, 2);
  let grade = 'F';
  if (pct >= 90) grade = 'A+';
  else if (pct >= 80) grade = 'A';
  else if (pct >= 70) grade = 'B';
  else if (pct >= 60) grade = 'C';
  else if (pct >= 50) grade = 'D';
  else if (pct >= 40) grade = 'E';

  return {
    percentage: pct,
    grade,
    isPassing: pct >= 40,
  };
}

export function gpaToPercentage(gpa: number, scale = 10, method: 'standard' | 'cbse' = 'cbse') {
  if (method === 'cbse') {
    // CBSE standard 9.5 multiplier
    return roundTo(gpa * 9.5, 2);
  }
  return roundTo((gpa / scale) * 100, 2);
}

export function percentageToGpa(percentage: number, scale = 10, method: 'standard' | 'cbse' = 'cbse') {
  if (method === 'cbse') {
    return roundTo(percentage / 9.5, 2);
  }
  return roundTo((percentage / 100) * scale, 2);
}
