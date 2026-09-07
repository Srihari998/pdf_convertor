import {
  calculateAttendance,
  calculateClassesCanMiss,
  calculateClassesNeeded,
  calculateWhatIfAttendance,
} from '../lib/calculators/attendance';
import { calculateGPA } from '../lib/calculators/gpa';
import { calculateEMI, calculateSIP, calculateGST, calculateDiscount } from '../lib/calculators/finance';
import { convertUnits } from '../lib/calculators/converters';
import { calculatePercentageOf, calculatePercentageChange } from '../lib/calculators/math';
import { calculateAge, isLeapYear } from '../lib/calculators/datetime';

function assertEqual(actual: unknown, expected: unknown, testName: string) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    console.error(`❌ FAILED: ${testName}`);
    console.error(`   Expected: ${expectedStr}`);
    console.error(`   Actual:   ${actualStr}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

console.log('--- STARTING CALCNEST UNIT TESTS ---\n');

// 1. ATTENDANCE TESTS (Specified in Prompt Requirements)
// Test: 18/20 at 75% -> Expected safe misses: 4
const test1 = calculateClassesCanMiss(18, 20, 75);
assertEqual(test1.canMissCount, 4, '18/20 at 75% safe misses = 4');
assertEqual(test1.projectedTable[4].projectedPercentage, 75.0, '18/20 after 4 misses = 75%');
assertEqual(test1.projectedTable[5].projectedPercentage, 72.0, '18/20 after 5 misses = 72%');

// Test: 0/20 at 75%
const test2 = calculateClassesCanMiss(0, 20, 75);
assertEqual(test2.canMissCount, 0, '0/20 at 75% cannot miss');

// Test: 1/1 at 75%
const test3 = calculateClassesCanMiss(1, 1, 75);
assertEqual(test3.canMissCount, 0, '1/1 at 75% (1/2 is 50%) cannot miss');

// Test: 74/100 at 75% -> cannot miss, classes needed = 4
const test4 = calculateClassesCanMiss(74, 100, 75);
assertEqual(test4.canMissCount, 0, '74/100 at 75% cannot miss');
const test4Need = calculateClassesNeeded(74, 100, 75);
assertEqual(test4Need.neededCount, 4, '74/100 at 75% needs 4 consecutive classes'); // (74+4)/(100+4) = 78/104 = 75.0%

// Test: 75/100 at 75% -> can miss 0
const test5 = calculateClassesCanMiss(75, 100, 75);
assertEqual(test5.canMissCount, 0, '75/100 at 75% can miss 0');

// Test: 76/100 at 75% -> can miss 1
const test6 = calculateClassesCanMiss(76, 100, 75);
assertEqual(test6.canMissCount, 1, '76/100 at 75% can miss 1'); // 76/101 = 75.25%

// Test: 100/100 at 75% -> can miss 33
const test7 = calculateClassesCanMiss(100, 100, 75);
assertEqual(test7.canMissCount, 33, '100/100 at 75% can miss 33'); // 100/133 = 75.18%, 100/134 = 74.62%

// 2. CGPA WEIGHTED TESTS (Specified in Prompt Requirements)
// Course A: 4 credits, 8 GP | Course B: 3 credits, 9 GP | Course C: 3 credits, 7 GP
// Expected: (4*8 + 3*9 + 3*7) / 10 = (32 + 27 + 21) / 10 = 80 / 10 = 8.0
const cgpaTest = calculateGPA([
  { id: '1', name: 'Course A', credit: 4, gradePoint: 8 },
  { id: '2', name: 'Course B', credit: 3, gradePoint: 9 },
  { id: '3', name: 'Course C', credit: 3, gradePoint: 7 },
]);
assertEqual(cgpaTest.gpa, 8.0, 'Weighted CGPA calculation');
assertEqual(cgpaTest.totalCredits, 10, 'Total credits sum');

// 3. EMI REDUCING-BALANCE TEST
// Principal: 10,00,000, 8.5% interest, 5 years (60 months)
const emiTest = calculateEMI(1000000, 8.5, 5);
assertEqual(emiTest.monthlyEMI, 20516.53, 'Reducing balance monthly EMI');
assertEqual(emiTest.totalPayment, 1230991.8, 'Total loan repayment amount');

// 4. SIP COMPOUND WEALTH TEST
// Monthly 10,000, 12% p.a., 10 years
const sipTest = calculateSIP(10000, 12, 10);
assertEqual(sipTest.investedAmount, 1200000, 'SIP total invested');
assertEqual(sipTest.totalValue > 2300000, true, 'SIP future value compounding');

// 5. GST TESTS (Add & Remove)
const gstAdd = calculateGST(10000, 18, 'add');
assertEqual(gstAdd.gstAmount, 1800, 'GST Add Amount');
assertEqual(gstAdd.finalAmount, 11800, 'GST Add Total');

const gstRemove = calculateGST(11800, 18, 'remove');
assertEqual(gstRemove.baseAmount, 10000, 'GST Remove Base');
assertEqual(gstRemove.gstAmount, 1800, 'GST Remove Amount');

// 6. PERCENTAGE & DISCOUNT TESTS
assertEqual(calculatePercentageOf(20, 500), 100, '20% of 500 = 100');
const discountTest = calculateDiscount(2500, 20);
assertEqual(discountTest.finalPrice, 2000, '20% discount on 2500 = 2000');

// 7. UNIT CONVERSION TESTS
const kgToLb = convertUnits('weight', 'kilogram', 'pound', 10);
assertEqual(Math.round(kgToLb.result * 100) / 100, 22.05, '10 kg to lbs');

const cToF = convertUnits('temperature', 'celsius', 'fahrenheit', 100);
assertEqual(cToF.result, 212, '100 C to F');

// 8. LEAP YEAR TESTS
assertEqual(isLeapYear(2000), true, '2000 is leap year');
assertEqual(isLeapYear(1900), false, '1900 is not leap year');
assertEqual(isLeapYear(2024), true, '2024 is leap year');
assertEqual(isLeapYear(2026), false, '2026 is not leap year');

console.log('\n🎉 ALL CALCULATION UNIT TESTS PASSED PERFECTLY!');
