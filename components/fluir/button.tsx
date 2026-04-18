'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-[var(--button-primary-bg)] text-white hover:bg-[var(--button-primary-hover)] active:bg-[var(--button-primary-active)] shadow-sm',
      secondary: 'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-fg)] hover:bg-[var(--button-secondary-hover)] active:bg-[var(--button-secondary-active)]',
      outline: 'border border-[var(--neutral-300)] text-[var(--neutral-700)] bg-white hover:border-[var(--navy-500)] hover:text-[var(--navy-700)] hover:bg-[var(--navy-50)] active:bg-[var(--navy-100)]',
      ghost: 'text-[var(--button-ghost-fg)] hover:bg-[var(--button-ghost-hover)] active:bg-[var(--button-ghost-active)]',
      destructive: 'bg-[var(--button-danger-bg)] text-white hover:bg-[var(--button-danger-hover)] active:bg-[var(--button-danger-active)] shadow-sm'
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-6 text-base'
    };
    
    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';