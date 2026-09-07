'use client';

import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import {
  calculateAttendance,
  calculateClassesCanMiss,
  calculateClassesNeeded,
  calculateWhatIfAttendance,
  calculateMarksPercentage,
  gpaToPercentage,
  percentageToGpa,
} from '../../lib/calculators/attendance';
import { calculateGPA, SubjectEntry } from '../../lib/calculators/gpa';
import { InputField } from '../common/InputField';
import { ResultCard } from '../common/ResultCard';

export function AttendanceCalculatorWidget() {
  const [attended, setAttended] = useState<string>('38');
  const [total, setTotal] = useState<string>('50');

  const attendedNum = Math.max(0, parseInt(attended, 10) || 0);
  const totalNum = Math.max(0, parseInt(total, 10) || 0);
  const result = calculateAttendance(attendedNum, totalNum);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="att-attended"
          label="Classes Attended"
          type="number"
          min={0}
          value={attended}
          onChange={setAttended}
          placeholder="e.g. 38"
          onClear={() => setAttended('')}
        />
        <InputField
          id="att-total"
          label="Total Classes Held"
          type="number"
          min={1}
          value={total}
          onChange={setTotal}
          placeholder="e.g. 50"
          onClear={() => setTotal('')}
        />
      </div>

      <ResultCard
        title="Attendance Summary"
        primaryLabel="Current Attendance Percentage"
        primaryValue={`${result.currentPercentage}%`}
        badge={{
          text: result.status === 'safe' ? 'Safe (Above 75%)' : result.status === 'warning' ? 'Warning (<75%)' : 'Critical (<65%)',
          variant: result.status === 'safe' ? 'success' : result.status === 'warning' ? 'warning' : 'danger',
        }}
        breakdown={[
          { label: 'Attended', value: `${attendedNum} Classes` },
          { label: 'Missed', value: `${Math.max(0, totalNum - attendedNum)} Classes`, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Total Held', value: `${totalNum} Classes` },
        ]}
      />

      <div className={`p-4 rounded-xl text-sm flex items-start gap-3 border ${
        result.status === 'safe'
          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
          : result.status === 'warning'
          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
          : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
      }`}>
        {result.status === 'safe' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />}
        <div>
          <p className="font-semibold">{result.statusText}</p>
        </div>
      </div>
    </div>
  );
}

export function ClassesCanIMissWidget() {
  const [attended, setAttended] = useState<string>('18');
  const [total, setTotal] = useState<string>('20');
  const [target, setTarget] = useState<string>('75');

  const attendedNum = Math.max(0, parseInt(attended, 10) || 0);
  const totalNum = Math.max(0, parseInt(total, 10) || 0);
  const targetNum = Math.min(100, Math.max(1, parseFloat(target) || 75));

  const result = calculateClassesCanMiss(attendedNum, totalNum, targetNum);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          id="miss-attended"
          label="Classes Attended"
          type="number"
          min={0}
          value={attended}
          onChange={setAttended}
          placeholder="e.g. 18"
          onClear={() => setAttended('')}
        />
        <InputField
          id="miss-total"
          label="Total Classes Held"
          type="number"
          min={1}
          value={total}
          onChange={setTotal}
          placeholder="e.g. 20"
          onClear={() => setTotal('')}
        />
        <InputField
          id="miss-target"
          label="Target Attendance %"
          type="number"
          min={1}
          max={100}
          unit="%"
          value={target}
          onChange={setTarget}
          placeholder="75"
        />
      </div>

      <ResultCard
        title="Safe Absences Calculation"
        primaryLabel="Maximum Safe Absences"
        primaryValue={result.canMissCount}
        primaryUnit={result.canMissCount === 1 ? 'class' : 'classes'}
        badge={{
          text: result.canMissCount > 0 ? `Can Miss ${result.canMissCount} Classes` : 'Cannot Miss Any Classes',
          variant: result.canMissCount > 0 ? 'success' : 'danger',
        }}
        breakdown={[
          { label: 'Current Attendance', value: `${result.currentPercentage}%` },
          { label: 'Target Threshold', value: `${targetNum}%` },
          { label: 'Attended / Total', value: `${attendedNum} / ${totalNum}` },
        ]}
      />

      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-sm font-medium border border-blue-200 dark:border-blue-800 flex items-start gap-2.5">
        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p>{result.message}</p>
      </div>

      {result.projectedTable.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Projected Attendance After Each Absence
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Classes Missed</th>
                  <th className="px-4 py-2.5 font-semibold">Total Classes</th>
                  <th className="px-4 py-2.5 font-semibold">Projected Attendance</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {result.projectedTable.map((row) => (
                  <tr
                    key={row.missedClasses}
                    className={
                      row.missedClasses === result.canMissCount
                        ? 'bg-amber-50/60 dark:bg-amber-950/30 font-semibold'
                        : ''
                    }
                  >
                    <td className="px-4 py-2.5 text-slate-900 dark:text-slate-100">
                      {row.missedClasses === 0 ? 'Current (0)' : `+ ${row.missedClasses} miss${row.missedClasses > 1 ? 'es' : ''}`}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{row.totalClasses}</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {row.projectedPercentage}%
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          row.isSafe
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300'
                        }`}
                      >
                        {row.isSafe ? 'Safe' : 'Debarred / Below Target'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function ClassesNeededWidget() {
  const [attended, setAttended] = useState<string>('30');
  const [total, setTotal] = useState<string>('50');
  const [target, setTarget] = useState<string>('75');

  const attendedNum = Math.max(0, parseInt(attended, 10) || 0);
  const totalNum = Math.max(0, parseInt(total, 10) || 0);
  const targetNum = Math.min(100, Math.max(1, parseFloat(target) || 75));

  const result = calculateClassesNeeded(attendedNum, totalNum, targetNum);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          id="need-attended"
          label="Classes Attended"
          type="number"
          min={0}
          value={attended}
          onChange={setAttended}
          placeholder="e.g. 30"
          onClear={() => setAttended('')}
        />
        <InputField
          id="need-total"
          label="Total Classes Held"
          type="number"
          min={1}
          value={total}
          onChange={setTotal}
          placeholder="e.g. 50"
          onClear={() => setTotal('')}
        />
        <InputField
          id="need-target"
          label="Target Attendance %"
          type="number"
          min={1}
          max={100}
          unit="%"
          value={target}
          onChange={setTarget}
          placeholder="75"
        />
      </div>

      <ResultCard
        title="Attendance Recovery"
        primaryLabel="Classes to Attend Next"
        primaryValue={result.neededCount >= 0 ? result.neededCount : 'Impossible'}
        primaryUnit={result.neededCount >= 0 ? (result.neededCount === 1 ? 'class' : 'classes') : ''}
        badge={{
          text: result.neededCount === 0 ? 'Target Achieved' : result.neededCount > 0 ? 'Recovery Needed' : 'Impossible',
          variant: result.neededCount === 0 ? 'success' : result.neededCount > 0 ? 'warning' : 'danger',
        }}
        breakdown={[
          { label: 'Current Attendance', value: `${result.currentPercentage}%` },
          { label: 'Target Percentage', value: `${targetNum}%` },
          { label: 'Consecutive Classes', value: result.neededCount > 0 ? `${result.neededCount} Needed` : '0' },
        ]}
      />

      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-sm font-medium border border-blue-200 dark:border-blue-800">
        <p>{result.message}</p>
      </div>
    </div>
  );
}

export function WhatIfAttendanceWidget() {
  const [attended, setAttended] = useState<string>('35');
  const [total, setTotal] = useState<string>('50');
  const [addAttend, setAddAttend] = useState<number>(5);
  const [addMiss, setAddMiss] = useState<number>(2);

  const attendedNum = Math.max(0, parseInt(attended, 10) || 0);
  const totalNum = Math.max(0, parseInt(total, 10) || 0);

  const res = calculateWhatIfAttendance(attendedNum, totalNum, addAttend, addMiss);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="whatif-attended"
          label="Current Attended Classes"
          type="number"
          value={attended}
          onChange={setAttended}
          placeholder="35"
        />
        <InputField
          id="whatif-total"
          label="Current Total Classes"
          type="number"
          value={total}
          onChange={setTotal}
          placeholder="50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Future Classes To Attend:
            </label>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{addAttend}</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            value={addAttend}
            onChange={(e) => setAddAttend(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Future Classes To Miss:
            </label>
            <span className="text-sm font-bold text-red-600 dark:text-red-400">+{addMiss}</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            value={addMiss}
            onChange={(e) => setAddMiss(parseInt(e.target.value, 10))}
            className="w-full accent-red-600 cursor-pointer"
          />
        </div>
      </div>

      <ResultCard
        title="Simulated Outcome"
        primaryLabel="Projected Attendance"
        primaryValue={`${res.newPercentage}%`}
        badge={{
          text: res.difference >= 0 ? `+${res.difference}% Increase` : `${res.difference}% Drop`,
          variant: res.difference >= 0 ? 'success' : 'danger',
        }}
        breakdown={[
          { label: 'Current Attendance', value: `${res.currentPercentage}%` },
          { label: 'New Attended', value: `${res.newAttended} classes` },
          { label: 'New Total', value: `${res.newTotal} classes` },
        ]}
      />
    </div>
  );
}

export function CGPACalculatorWidget() {
  const [subjects, setSubjects] = useState<SubjectEntry[]>([
    { id: '1', name: 'Course 1', credit: 4, gradePoint: 9 },
    { id: '2', name: 'Course 2', credit: 4, gradePoint: 8 },
    { id: '3', name: 'Course 3', credit: 3, gradePoint: 9 },
    { id: '4', name: 'Course 4', credit: 3, gradePoint: 7 },
    { id: '5', name: 'Lab 1', credit: 2, gradePoint: 10 },
  ]);

  const handleAddSubject = () => {
    const newId = (subjects.length + 1).toString();
    setSubjects([...subjects, { id: newId, name: `Course ${subjects.length + 1}`, credit: 3, gradePoint: 8 }]);
  };

  const handleRemoveSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleUpdate = (id: string, field: 'name' | 'credit' | 'gradePoint', value: string) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id !== id) return s;
        if (field === 'name') return { ...s, name: value };
        const numVal = parseFloat(value) || 0;
        return { ...s, [field]: numVal };
      })
    );
  };

  const result = calculateGPA(subjects);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-6">Subject / Course Name</div>
          <div className="col-span-3">Credits</div>
          <div className="col-span-2">Grade Point (0-10)</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        {subjects.map((sub, idx) => (
          <div
            key={sub.id}
            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 items-center"
          >
            <div className="sm:col-span-6">
              <input
                type="text"
                value={sub.name}
                onChange={(e) => handleUpdate(sub.id, 'name', e.target.value)}
                placeholder={`Subject ${idx + 1}`}
                className="w-full bg-white dark:bg-slate-900 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="sm:col-span-3">
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={sub.credit || ''}
                onChange={(e) => handleUpdate(sub.id, 'credit', e.target.value)}
                placeholder="Credits"
                className="w-full bg-white dark:bg-slate-900 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={sub.gradePoint || ''}
                onChange={(e) => handleUpdate(sub.id, 'gradePoint', e.target.value)}
                placeholder="GP (0-10)"
                className="w-full bg-white dark:bg-slate-900 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold"
              />
            </div>
            <div className="sm:col-span-1 text-center flex justify-end sm:justify-center">
              <button
                type="button"
                onClick={() => handleRemoveSubject(sub.id)}
                disabled={subjects.length <= 1}
                className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-30 cursor-pointer"
                aria-label="Remove subject"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleAddSubject}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>

        <span className="text-xs text-slate-500 dark:text-slate-400">
          Total Subjects: {subjects.length}
        </span>
      </div>

      <ResultCard
        title="Weighted CGPA Result"
        primaryLabel="Cumulative Grade Point Average"
        primaryValue={result.gpa}
        primaryUnit="/ 10.0"
        badge={{ text: result.letterGrade, variant: result.gpa >= 8 ? 'success' : result.gpa >= 6 ? 'info' : 'warning' }}
        breakdown={[
          { label: 'Total Credits', value: result.totalCredits },
          { label: 'Weighted Points', value: result.totalGradePoints },
          { label: 'Percentage Equivalent', value: `${result.percentageEquivalent}%` },
        ]}
      />
    </div>
  );
}

export function MarksPercentageWidget() {
  const [obtained, setObtained] = useState<string>('440');
  const [total, setTotal] = useState<string>('500');

  const obtainedNum = parseFloat(obtained) || 0;
  const totalNum = parseFloat(total) || 0;
  const res = calculateMarksPercentage(obtainedNum, totalNum);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="marks-obtained"
          label="Marks Obtained"
          type="number"
          value={obtained}
          onChange={setObtained}
          placeholder="440"
        />
        <InputField
          id="marks-total"
          label="Maximum / Total Marks"
          type="number"
          value={total}
          onChange={setTotal}
          placeholder="500"
        />
      </div>

      <ResultCard
        title="Marks Summary"
        primaryLabel="Percentage Score"
        primaryValue={`${res.percentage}%`}
        badge={{
          text: `Grade: ${res.grade} (${res.isPassing ? 'Passed' : 'Failed'})`,
          variant: res.isPassing ? 'success' : 'danger',
        }}
        breakdown={[
          { label: 'Obtained', value: obtainedNum },
          { label: 'Total Possible', value: totalNum },
          { label: 'Letter Grade', value: res.grade },
        ]}
      />
    </div>
  );
}

export function GpaToPercentageWidget() {
  const [gpa, setGpa] = useState<string>('8.4');
  const [scale, setScale] = useState<number>(10);
  const [method, setMethod] = useState<'cbse' | 'standard'>('cbse');

  const gpaNum = parseFloat(gpa) || 0;
  const pct = gpaToPercentage(gpaNum, scale, method);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="gpa-input"
          label="Enter CGPA / GPA"
          type="number"
          step={0.01}
          value={gpa}
          onChange={setGpa}
          placeholder="8.4"
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            Conversion Standard
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'cbse' | 'standard')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 sm:py-3 px-3 text-slate-900 dark:text-slate-100 text-sm font-medium"
          >
            <option value="cbse">CBSE & AICTE 9.5 Formula (CGPA × 9.5)</option>
            <option value="standard">Direct Ratio Scale (GPA / Scale × 100)</option>
          </select>
        </div>
      </div>

      <ResultCard
        title="Percentage Conversion"
        primaryLabel="Equivalent Percentage"
        primaryValue={`${pct}%`}
        breakdown={[
          { label: 'Input GPA', value: gpaNum },
          { label: 'Formula Used', value: method === 'cbse' ? 'CGPA × 9.5' : `(CGPA / ${scale}) × 100` },
        ]}
      />
    </div>
  );
}

export function PercentageToGpaWidget() {
  const [percentage, setPercentage] = useState<string>('85');
  const [method, setMethod] = useState<'cbse' | 'standard'>('cbse');

  const pctNum = parseFloat(percentage) || 0;
  const gpa = percentageToGpa(pctNum, 10, method);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="pct-input"
          label="Enter Percentage Score"
          type="number"
          unit="%"
          value={percentage}
          onChange={setPercentage}
          placeholder="85"
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            Conversion Scale
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'cbse' | 'standard')}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 sm:py-3 px-3 text-slate-900 dark:text-slate-100 text-sm font-medium"
          >
            <option value="cbse">CBSE 10-point Scale (Percentage / 9.5)</option>
            <option value="standard">Direct 10.0 Scale</option>
          </select>
        </div>
      </div>

      <ResultCard
        title="GPA Conversion"
        primaryLabel="Equivalent CGPA"
        primaryValue={gpa}
        primaryUnit="/ 10.0"
        breakdown={[
          { label: 'Input Percentage', value: `${pctNum}%` },
          { label: 'Scale', value: '10.0 GPA' },
        ]}
      />
    </div>
  );
}

export function ExamCountdownWidget() {
  const [examName, setExamName] = useState('Final Semester Exam');
  const [targetDate, setTargetDate] = useState('2026-11-15');

  const diffMs = new Date(targetDate).getTime() - new Date().getTime();
  const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="exam-name"
          label="Exam / Milestone Title"
          type="text"
          value={examName}
          onChange={setExamName}
          placeholder="e.g. Midterm Exams"
        />
        <InputField
          id="exam-date"
          label="Exam Date"
          type="date"
          value={targetDate}
          onChange={setTargetDate}
        />
      </div>

      <ResultCard
        title="Live Exam Countdown"
        primaryLabel={`Time Remaining for ${examName}`}
        primaryValue={daysLeft}
        primaryUnit={daysLeft === 1 ? 'Day Left' : 'Days Left'}
        breakdown={[
          { label: 'Target Date', value: targetDate },
          { label: 'Estimated Weeks', value: Math.floor(daysLeft / 7) },
          { label: 'Total Hours', value: daysLeft * 24 },
        ]}
      />
    </div>
  );
}
