'use client';

import React, { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, value, onChange, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || options[0]?.value);

    const selectedOption = options.find(opt => opt.value === selectedValue);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      setIsOpen(false);
      
      // Trigger onChange pour le formulaire
      if (onChange) {
        const fakeEvent = {
          target: { name: props.name, value: optionValue }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(fakeEvent);
      }
    };

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Custom Select Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              'flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm h-11 bg-white transition-all',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              'hover:border-blue-500',
              {
                'border-red-500 bg-red-50': error,
                'border-gray-300': !error,
                'border-blue-500': isOpen && !error,
              },
              className
            )}
          >
            <span className="text-gray-900">{selectedOption?.label}</span>
            <ChevronDown className={clsx(
              'h-4 w-4 opacity-50 transition-transform',
              isOpen && 'rotate-180'
            )} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={clsx(
                      'w-full px-3 py-2.5 text-left text-sm transition-colors flex items-center justify-between',
                      selectedValue === option.value
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    <span>{option.label}</span>
                    {selectedValue === option.value && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Hidden native select for form */}
          <select
            ref={ref}
            value={selectedValue}
            onChange={(e) => {
              setSelectedValue(e.target.value);
              onChange?.(e);
            }}
            className="sr-only"
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';