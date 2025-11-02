// src/components/ui/Select.tsx
import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={clsx(
              'w-full px-4 py-3 pr-10 border rounded-lg appearance-none focus:outline-none focus:ring-2 transition-all bg-white cursor-pointer',
              'hover:border-red-500 hover:bg-red-50',
              {
                'border-red-500 focus:ring-red-500 bg-red-50': error,
                'border-gray-300 focus:ring-blue-500 focus:border-blue-500': !error,
              },
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-white hover:bg-red-50">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-hover:text-red-500" size={20} />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';