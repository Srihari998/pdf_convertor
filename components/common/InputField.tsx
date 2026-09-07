'use client';

import React from 'react';
import { X } from 'lucide-react';

interface InputFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'date' | 'time';
  placeholder?: string;
  unit?: string;
  prefix?: string;
  helpText?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number | string;
  required?: boolean;
  onClear?: () => void;
  className?: string;
}

export function InputField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  unit,
  prefix,
  helpText,
  error,
  min,
  max,
  step,
  required,
  onClear,
  className = '',
}: InputFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {unit && <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{unit}</span>}
      </div>

      <div className="relative rounded-xl shadow-xs">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <span className="text-slate-500 dark:text-slate-400 sm:text-sm font-medium">{prefix}</span>
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`block w-full rounded-xl border bg-white dark:bg-slate-900 py-2.5 sm:py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 transition-colors sm:text-base ${
            prefix ? 'pl-9' : 'pl-3.5'
          } ${onClear && value ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-red-400 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600/20 dark:focus:ring-blue-500/20'
          }`}
        />

        {onClear && value !== '' && value !== 0 && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            aria-label={`Clear ${label}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
      ) : helpText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
      ) : null}
    </div>
  );
}
