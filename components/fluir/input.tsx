'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full h-11 px-4 rounded-lg border transition-all duration-200',
            'bg-white text-[var(--neutral-900)] placeholder:text-[var(--neutral-400)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--navy-500)] focus:border-transparent',
            error
              ? 'border-[var(--error)] focus:ring-[var(--error)]'
              : 'border-[var(--neutral-300)] hover:border-[var(--neutral-400)]',
            'disabled:bg-[var(--neutral-100)] disabled:cursor-not-allowed disabled:opacity-60',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[var(--neutral-500)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';