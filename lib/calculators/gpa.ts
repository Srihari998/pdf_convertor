import { roundTo } from '../formatters';

export interface SubjectEntry {
  id: string;
  name: string;
  credit: number;
  gradePoint: number;
}

export interface GPAResult {
  gpa: number;
  totalCredits: number;
  totalGradePoints: number;
  percentageEquivalent: number;
  letterGrade: string;
}

export function calculateGPA(subjects: SubjectEntry[]): GPAResult {
  let totalCredits = 0;
  let totalWeightedPoints = 0;

  for (const sub of subjects) {
    const cred = Math.max(0, sub.credit || 0);
    const gp = Math.max(0, sub.gradePoint || 0);
    totalCredits += cred;
    totalWeightedPoints += cred * gp;
  }

  if (totalCredits <= 0) {
    return {
      gpa: 0,
      totalCredits: 0,
      totalGradePoints: 0,
      percentageEquivalent: 0,
      letterGrade: 'N/A',
    };
  }

  const gpa = roundTo(totalWeightedPoints / totalCredits, 2);
  const percentageEquivalent = roundTo(gpa * 9.5, 2); // standard university mapping

  let letterGrade = 'F';
  if (gpa >= 9) letterGrade = 'O (Outstanding)';
  else if (gpa >= 8) letterGrade = 'A+ (Excellent)';
  else if (gpa >= 7) letterGrade = 'A (Very Good)';
  else if (gpa >= 6) letterGrade = 'B+ (Good)';
  else if (gpa >= 5) letterGrade = 'B (Above Average)';
  else if (gpa >= 4) letterGrade = 'C (Pass)';

  return {
    gpa,
    totalCredits,
    totalGradePoints: roundTo(totalWeightedPoints, 2),
    percentageEquivalent,
    letterGrade,
  };
}
