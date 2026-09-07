'use client';

import React, { useState } from 'react';
import {
  calculateEMI,
  calculateSIP,
  calculateGST,
  calculateDiscount,
  calculateSalaryCTC,
  calculateSalaryHike,
  calculateCompoundInterest,
  calculateSimpleInterest,
  calculateFD,
  calculateRD,
  calculatePPF,
  calculateInflation,
  calculateCAGR,
  calculateLumpSum,
  calculateROI,
  calculateRuleOf72,
  calculateHomeLoanEligibility,
} from '../../lib/calculators/finance';
import { formatCurrencyINR } from '../../lib/formatters';
import { InputField } from '../common/InputField';
import { ResultCard } from '../common/ResultCard';

export function EMICalculatorWidget() {
  const [amount, setAmount] = useState('1000000');
  const [rate, setRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('5');
  const [tenureMonths, setTenureMonths] = useState('0');
  const [showAmortization, setShowAmortization] = useState(false);

  const p = Math.max(0, parseFloat(amount) || 0);
  const r = Math.max(0, parseFloat(rate) || 0);
  const y = Math.max(0, parseFloat(tenureYears) || 0);
  const m = Math.max(0, parseFloat(tenureMonths) || 0);

  const res = calculateEMI(p, r, y, m);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          id="emi-amount"
          label="Loan Principal Amount"
          type="number"
          prefix="₹"
          value={amount}
          onChange={setAmount}
          placeholder="1000000"
          onClear={() => setAmount('')}
        />
        <InputField
          id="emi-rate"
          label="Annual Interest Rate (%)"
          type="number"
          step={0.1}
          unit="%"
          value={rate}
          onChange={setRate}
          placeholder="8.5"
        />
        <InputField
          id="emi-tenure-years"
          label="Loan Tenure (Years)"
          type="number"
          unit="Years"
          value={tenureYears}
          onChange={setTenureYears}
          placeholder="5"
        />
      </div>

      <ResultCard
        title="Monthly Payment Overview"
        primaryLabel="Monthly EMI"
        primaryValue={formatCurrencyINR(res.monthlyEMI)}
        breakdown={[
          { label: 'Principal Amount', value: formatCurrencyINR(res.principalAmount) },
          { label: 'Total Interest', value: formatCurrencyINR(res.totalInterest), color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Total Repayment', value: formatCurrencyINR(res.totalPayment), color: 'text-blue-600 dark:text-blue-400' },
        ]}
      />

      {res.amortizationSchedule.length > 0 && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowAmortization(!showAmortization)}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:bg-slate-100 cursor-pointer text-center"
          >
            {showAmortization ? 'Hide Yearly Amortization Schedule ▲' : 'View Yearly Amortization Schedule ▼'}
          </button>

          {showAmortization && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Year</th>
                      <th className="px-4 py-2.5 font-semibold">Principal Paid</th>
                      <th className="px-4 py-2.5 font-semibold">Interest Paid</th>
                      <th className="px-4 py-2.5 font-semibold">Outstanding Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {res.amortizationSchedule.map((row) => (
                      <tr key={row.year}>
                        <td className="px-4 py-2.5 font-semibold text-slate-900 dark:text-slate-100">Year {row.year}</td>
                        <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-medium">{formatCurrencyINR(row.principalPaid)}</td>
                        <td className="px-4 py-2.5 text-amber-600 dark:text-amber-400 font-medium">{formatCurrencyINR(row.interestPaid)}</td>
                        <td className="px-4 py-2.5 font-semibold text-slate-900 dark:text-slate-100">{formatCurrencyINR(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SIPCalculatorWidget() {
  const [monthly, setMonthly] = useState('10000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('10');

  const p = Math.max(0, parseFloat(monthly) || 0);
  const r = Math.max(0, parseFloat(rate) || 0);
  const y = Math.max(0, parseFloat(years) || 0);

  const res = calculateSIP(p, r, y);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          id="sip-monthly"
          label="Monthly Investment"
          type="number"
          prefix="₹"
          value={monthly}
          onChange={setMonthly}
          placeholder="10000"
        />
        <InputField
          id="sip-rate"
          label="Expected Annual Return (%)"
          type="number"
          step={0.5}
          unit="%"
          value={rate}
          onChange={setRate}
          placeholder="12"
        />
        <InputField
          id="sip-years"
          label="Investment Duration (Years)"
          type="number"
          unit="Years"
          value={years}
          onChange={setYears}
          placeholder="10"
        />
      </div>

      <ResultCard
        title="SIP Wealth Growth"
        primaryLabel="Total Expected Corpus"
        primaryValue={formatCurrencyINR(res.totalValue)}
        badge={{ text: 'Power of Compounding', variant: 'success' }}
        breakdown={[
          { label: 'Invested Capital', value: formatCurrencyINR(res.investedAmount) },
          { label: 'Estimated Wealth Gain', value: formatCurrencyINR(res.estimatedReturns), color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Total Value', value: formatCurrencyINR(res.totalValue), color: 'text-blue-600 dark:text-blue-400' },
        ]}
      />
    </div>
  );
}

export function GSTCalculatorWidget() {
  const [amount, setAmount] = useState('10000');
  const [rate, setRate] = useState<number>(18);
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  const amtNum = Math.max(0, parseFloat(amount) || 0);
  const res = calculateGST(amtNum, rate, mode);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 max-w-sm">
        <button
          type="button"
          onClick={() => setMode('add')}
          className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'add' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Add GST (Exclusive)
        </button>
        <button
          type="button"
          onClick={() => setMode('remove')}
          className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            mode === 'remove' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Remove GST (Inclusive)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="gst-amount"
          label={mode === 'add' ? 'Net Amount (Before GST)' : 'Gross Amount (Including GST)'}
          type="number"
          prefix="₹"
          value={amount}
          onChange={setAmount}
          placeholder="10000"
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            GST Tax Slab Rate
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 12, 18, 28].map((slab) => (
              <button
                key={slab}
                type="button"
                onClick={() => setRate(slab)}
                className={`py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                  rate === slab
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {slab}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResultCard
        title="GST Tax Breakdown"
        primaryLabel={mode === 'add' ? 'Total Bill (with GST)' : 'Base Price (without GST)'}
        primaryValue={formatCurrencyINR(mode === 'add' ? res.finalAmount : res.baseAmount)}
        breakdown={[
          { label: 'Base Net Price', value: formatCurrencyINR(res.baseAmount) },
          { label: `Total GST (${rate}%)`, value: formatCurrencyINR(res.gstAmount), color: 'text-blue-600 dark:text-blue-400' },
          { label: 'CGST (Central)', value: formatCurrencyINR(res.cgst) },
          { label: 'SGST (State)', value: formatCurrencyINR(res.sgst) },
        ]}
      />
    </div>
  );
}

export function DiscountCalculatorWidget() {
  const [original, setOriginal] = useState('2499');
  const [discount, setDiscount] = useState('30');

  const origNum = Math.max(0, parseFloat(original) || 0);
  const discNum = Math.max(0, parseFloat(discount) || 0);
  const res = calculateDiscount(origNum, discNum);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="disc-original"
          label="Original Price"
          type="number"
          prefix="₹"
          value={original}
          onChange={setOriginal}
          placeholder="2499"
        />
        <InputField
          id="disc-percent"
          label="Discount Percentage"
          type="number"
          unit="%"
          value={discount}
          onChange={setDiscount}
          placeholder="30"
        />
      </div>

      <ResultCard
        title="Discount Calculation"
        primaryLabel="Final Discounted Price"
        primaryValue={formatCurrencyINR(res.finalPrice)}
        badge={{ text: `You Save ${formatCurrencyINR(res.savings)}`, variant: 'success' }}
        breakdown={[
          { label: 'Original Price', value: formatCurrencyINR(origNum) },
          { label: 'Discount Amount', value: formatCurrencyINR(res.discountAmount), color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Final Price', value: formatCurrencyINR(res.finalPrice), color: 'text-blue-600 dark:text-blue-400' },
        ]}
      />
    </div>
  );
}

export function SalaryCalculatorWidget() {
  const [ctc, setCtc] = useState('1200000');
  const [deductions, setDeductions] = useState('0');

  const ctcNum = Math.max(0, parseFloat(ctc) || 0);
  const dedNum = Math.max(0, parseFloat(deductions) || 0);
  const res = calculateSalaryCTC(ctcNum, dedNum);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="salary-ctc"
          label="Annual CTC (Cost to Company)"
          type="number"
          prefix="₹"
          value={ctc}
          onChange={setCtc}
          placeholder="1200000"
        />
        <InputField
          id="salary-ded"
          label="Optional Monthly Deductions"
          type="number"
          prefix="₹"
          value={deductions}
          onChange={setDeductions}
          placeholder="0"
        />
      </div>

      <ResultCard
        title="Estimated Salary Breakdown"
        primaryLabel="Estimated Monthly In-Hand Salary"
        primaryValue={formatCurrencyINR(res.estimatedInHandMonthly)}
        breakdown={[
          { label: 'Monthly Gross CTC', value: formatCurrencyINR(res.monthlyCTC) },
          { label: 'Employee PF (/mo)', value: formatCurrencyINR(res.monthlyPF) },
          { label: 'Est. Tax & Others (/mo)', value: formatCurrencyINR(res.monthlyTaxEstimate + res.otherDeductions) },
          { label: 'Annual In-Hand Est.', value: formatCurrencyINR(res.estimatedInHandAnnual), color: 'text-emerald-600 dark:text-emerald-400' },
        ]}
      />
    </div>
  );
}

export function SalaryHikeCalculatorWidget() {
  const [salary, setSalary] = useState('800000');
  const [hike, setHike] = useState('25');

  const salNum = Math.max(0, parseFloat(salary) || 0);
  const hikeNum = Math.max(0, parseFloat(hike) || 0);
  const res = calculateSalaryHike(salNum, hikeNum);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="hike-current"
          label="Current Annual CTC"
          type="number"
          prefix="₹"
          value={salary}
          onChange={setSalary}
          placeholder="800000"
        />
        <InputField
          id="hike-percent"
          label="Hike Percentage"
          type="number"
          unit="%"
          value={hike}
          onChange={setHike}
          placeholder="25"
        />
      </div>

      <ResultCard
        title="Increment Summary"
        primaryLabel="New Annual CTC"
        primaryValue={formatCurrencyINR(res.newSalary)}
        badge={{ text: `+${formatCurrencyINR(res.monthlyDifference)} / month`, variant: 'success' }}
        breakdown={[
          { label: 'Current Salary', value: formatCurrencyINR(salNum) },
          { label: 'Annual Increment', value: formatCurrencyINR(res.hikeAmount), color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Monthly Difference', value: formatCurrencyINR(res.monthlyDifference) },
        ]}
      />
    </div>
  );
}

export function CompoundInterestWidget() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('8');
  const [years, setYears] = useState('5');
  const [frequency, setFrequency] = useState<number>(1);

  const p = parseFloat(principal) || 0;
  const r = parseFloat(rate) || 0;
  const y = parseFloat(years) || 0;
  const res = calculateCompoundInterest(p, r, y, frequency);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="ci-p" label="Principal Amount" type="number" prefix="₹" value={principal} onChange={setPrincipal} />
        <InputField id="ci-r" label="Interest Rate" type="number" unit="%" value={rate} onChange={setRate} />
        <InputField id="ci-y" label="Time (Years)" type="number" unit="Years" value={years} onChange={setYears} />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Compounding Frequency</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(parseInt(e.target.value, 10))}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 sm:py-3 px-3 text-slate-900 dark:text-slate-100 text-sm font-medium"
        >
          <option value={1}>Annually (1 time/year)</option>
          <option value={2}>Semi-Annually (2 times/year)</option>
          <option value={4}>Quarterly (4 times/year - standard FD)</option>
          <option value={12}>Monthly (12 times/year)</option>
        </select>
      </div>

      <ResultCard
        title="Compounded Amount"
        primaryLabel="Total Maturity Amount"
        primaryValue={formatCurrencyINR(res.totalAmount)}
        breakdown={[
          { label: 'Principal', value: formatCurrencyINR(p) },
          { label: 'Total Interest Earned', value: formatCurrencyINR(res.totalInterest), color: 'text-emerald-600 dark:text-emerald-400' },
        ]}
      />
    </div>
  );
}

export function SimpleInterestWidget() {
  const [p, setP] = useState('50000');
  const [r, setR] = useState('7.5');
  const [t, setT] = useState('3');

  const pNum = parseFloat(p) || 0;
  const rNum = parseFloat(r) || 0;
  const tNum = parseFloat(t) || 0;
  const res = calculateSimpleInterest(pNum, rNum, tNum);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="si-p" label="Principal Amount" type="number" prefix="₹" value={p} onChange={setP} />
        <InputField id="si-r" label="Annual Rate (%)" type="number" unit="%" value={r} onChange={setR} />
        <InputField id="si-t" label="Time Duration (Years)" type="number" unit="Years" value={t} onChange={setT} />
      </div>

      <ResultCard
        title="Simple Interest Result"
        primaryLabel="Total Payoff Amount"
        primaryValue={formatCurrencyINR(res.totalAmount)}
        breakdown={[
          { label: 'Principal Amount', value: formatCurrencyINR(pNum) },
          { label: 'Simple Interest', value: formatCurrencyINR(res.totalInterest), color: 'text-amber-600 dark:text-amber-400' },
        ]}
      />
    </div>
  );
}

export function FDCalculatorWidget() {
  const [amount, setAmount] = useState('200000');
  const [rate, setRate] = useState('7.1');
  const [years, setYears] = useState('3');

  const res = calculateFD(parseFloat(amount) || 0, parseFloat(rate) || 0, parseFloat(years) || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="fd-p" label="Deposit Amount" type="number" prefix="₹" value={amount} onChange={setAmount} />
        <InputField id="fd-r" label="Interest Rate (%)" type="number" unit="%" value={rate} onChange={setRate} />
        <InputField id="fd-y" label="Tenure (Years)" type="number" unit="Years" value={years} onChange={setYears} />
      </div>

      <ResultCard
        title="FD Maturity Calculation (Quarterly Compounding)"
        primaryLabel="Maturity Value"
        primaryValue={formatCurrencyINR(res.totalAmount)}
        breakdown={[
          { label: 'Principal Invested', value: formatCurrencyINR(res.principal) },
          { label: 'Total Interest Earned', value: formatCurrencyINR(res.totalInterest), color: 'text-emerald-600 dark:text-emerald-400' },
        ]}
      />
    </div>
  );
}

export function RDCalculatorWidget() {
  const [monthly, setMonthly] = useState('5000');
  const [rate, setRate] = useState('6.8');
  const [months, setMonths] = useState('24');

  const res = calculateRD(parseFloat(monthly) || 0, parseFloat(rate) || 0, parseInt(months, 10) || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="rd-m" label="Monthly Installment" type="number" prefix="₹" value={monthly} onChange={setMonthly} />
        <InputField id="rd-r" label="Interest Rate (%)" type="number" unit="%" value={rate} onChange={setRate} />
        <InputField id="rd-mo" label="Tenure (Months)" type="number" unit="Months" value={months} onChange={setMonths} />
      </div>

      <ResultCard
        title="RD Maturity Value"
        primaryLabel="Maturity Corpus"
        primaryValue={formatCurrencyINR(res.maturityAmount)}
        breakdown={[
          { label: 'Total Invested', value: formatCurrencyINR(res.totalInvested) },
          { label: 'Interest Earned', value: formatCurrencyINR(res.interestEarned), color: 'text-emerald-600 dark:text-emerald-400' },
        ]}
      />
    </div>
  );
}

export function PPFCalculatorWidget() {
  const [yearly, setYearly] = useState('150000');
  const res = calculatePPF(parseFloat(yearly) || 0);

  return (
    <div className="space-y-6">
      <InputField
        id="ppf-yearly"
        label="Yearly Investment (Max ₹1.5 Lakh/yr)"
        type="number"
        prefix="₹"
        value={yearly}
        onChange={setYearly}
      />

      <ResultCard
        title="15-Year PPF Maturity (Tax Free @ 7.1%)"
        primaryLabel="15-Year Maturity Corpus"
        primaryValue={formatCurrencyINR(res.maturityAmount)}
        badge={{ text: '100% Tax Free (EEE)', variant: 'success' }}
        breakdown={[
          { label: 'Total Invested (15 yrs)', value: formatCurrencyINR(res.totalInvested) },
          { label: 'Total Interest Earned', value: formatCurrencyINR(res.totalInterest), color: 'text-emerald-600 dark:text-emerald-400' },
        ]}
      />
    </div>
  );
}

export function InflationCalculatorWidget() {
  const [amount, setAmount] = useState('100000');
  const [rate, setRate] = useState('6');
  const [years, setYears] = useState('10');

  const res = calculateInflation(parseFloat(amount) || 0, parseFloat(rate) || 0, parseFloat(years) || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="inf-amt" label="Current Cost / Amount" type="number" prefix="₹" value={amount} onChange={setAmount} />
        <InputField id="inf-rate" label="Annual Inflation Rate (%)" type="number" unit="%" value={rate} onChange={setRate} />
        <InputField id="inf-yr" label="Years in Future" type="number" unit="Years" value={years} onChange={setYears} />
      </div>

      <ResultCard
        title="Future Purchasing Power"
        primaryLabel={`Equivalent Cost in ${years} Years`}
        primaryValue={formatCurrencyINR(res.futureAmount)}
        badge={{ text: `+${formatCurrencyINR(res.lossOfValue)} Inflation Impact`, variant: 'danger' }}
        breakdown={[
          { label: 'Current Value', value: formatCurrencyINR(res.presentAmount) },
          { label: 'Future Value Required', value: formatCurrencyINR(res.futureAmount) },
        ]}
      />
    </div>
  );
}

export function CAGRCalculatorWidget() {
  const [init, setInit] = useState('100000');
  const [final, setFinal] = useState('250000');
  const [years, setYears] = useState('5');

  const res = calculateCAGR(parseFloat(init) || 0, parseFloat(final) || 0, parseFloat(years) || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="cagr-init" label="Initial Investment" type="number" prefix="₹" value={init} onChange={setInit} />
        <InputField id="cagr-final" label="Final Value" type="number" prefix="₹" value={final} onChange={setFinal} />
        <InputField id="cagr-yr" label="Time Duration (Years)" type="number" unit="Years" value={years} onChange={setYears} />
      </div>

      <ResultCard
        title="Annualized Growth Metric"
        primaryLabel="Compound Annual Growth Rate (CAGR)"
        primaryValue={`${res.cagr}%`}
        breakdown={[
          { label: 'Absolute Return', value: `${res.absoluteReturn}%` },
          { label: 'Years', value: years },
        ]}
      />
    </div>
  );
}

export function LumpSumCalculatorWidget() {
  const [investment, setInvestment] = useState('100000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('5');

  const res = calculateLumpSum(parseFloat(investment) || 0, parseFloat(rate) || 0, parseFloat(years) || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="ls-amt" label="One-Time Investment" type="number" prefix="₹" value={investment} onChange={setInvestment} />
        <InputField id="ls-rate" label="Expected Return (%)" type="number" unit="%" value={rate} onChange={setRate} />
        <InputField id="ls-yr" label="Tenure (Years)" type="number" unit="Years" value={years} onChange={setYears} />
      </div>

      <ResultCard
        title="Lump Sum Investment Returns"
        primaryLabel="Expected Future Value"
        primaryValue={formatCurrencyINR(res.totalValue)}
        breakdown={[
          { label: 'Invested Capital', value: formatCurrencyINR(res.investment) },
          { label: 'Total Returns', value: formatCurrencyINR(res.totalReturns), color: 'text-emerald-600 dark:text-emerald-400' },
        ]}
      />
    </div>
  );
}

export function ROICalculatorWidget() {
  const [cost, setCost] = useState('50000');
  const [revenue, setRevenue] = useState('75000');
  const [years, setYears] = useState('1');

  const res = calculateROI(parseFloat(cost) || 0, parseFloat(revenue) || 0, parseFloat(years) || 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField id="roi-c" label="Total Investment Cost" type="number" prefix="₹" value={cost} onChange={setCost} />
        <InputField id="roi-r" label="Final Total Return" type="number" prefix="₹" value={revenue} onChange={setRevenue} />
        <InputField id="roi-y" label="Duration (Years)" type="number" unit="Years" value={years} onChange={setYears} />
      </div>

      <ResultCard
        title="Return on Investment"
        primaryLabel="Total ROI Percentage"
        primaryValue={`${res.roi}%`}
        breakdown={[
          { label: 'Net Profit', value: formatCurrencyINR(res.netProfit), color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Annualized ROI', value: `${res.annualizedROI}% / yr` },
        ]}
      />
    </div>
  );
}

export function RuleOf72Widget() {
  const [rate, setRate] = useState('12');
  const res = calculateRuleOf72(parseFloat(rate) || 0);

  return (
    <div className="space-y-6">
      <InputField id="r72-rate" label="Annual Interest / Return Rate (%)" type="number" unit="%" value={rate} onChange={setRate} />

      <ResultCard
        title="Rule of 72 Doubling Time"
        primaryLabel="Time to Double Your Money"
        primaryValue={res.yearsToDouble}
        primaryUnit={res.yearsToDouble === 1 ? 'Year' : 'Years'}
        breakdown={[
          { label: 'Interest Rate', value: `${rate}%` },
          { label: 'Formula', value: '72 / Rate' },
        ]}
      />
    </div>
  );
}

export function HomeLoanEligibilityWidget() {
  const [income, setIncome] = useState('100000');
  const [existingEMI, setExistingEMI] = useState('10000');
  const [rate, setRate] = useState('8.5');
  const [years, setYears] = useState('20');

  const res = calculateHomeLoanEligibility(
    parseFloat(income) || 0,
    parseFloat(existingEMI) || 0,
    parseFloat(rate) || 8.5,
    parseFloat(years) || 20
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField id="hle-inc" label="Monthly Gross Salary / Income" type="number" prefix="₹" value={income} onChange={setIncome} />
        <InputField id="hle-emi" label="Existing Monthly Loan EMIs" type="number" prefix="₹" value={existingEMI} onChange={setExistingEMI} />
        <InputField id="hle-rate" label="Loan Interest Rate (%)" type="number" unit="%" value={rate} onChange={setRate} />
        <InputField id="hle-yr" label="Loan Tenure (Years)" type="number" unit="Years" value={years} onChange={setYears} />
      </div>

      <ResultCard
        title="Loan Eligibility Estimate"
        primaryLabel="Eligible Home Loan Amount"
        primaryValue={formatCurrencyINR(res.eligibleLoanAmount)}
        breakdown={[
          { label: 'Maximum Monthly EMI Capacity', value: formatCurrencyINR(res.maxEMI) },
          { label: 'Tenure', value: `${years} Years` },
        ]}
      />
    </div>
  );
}
