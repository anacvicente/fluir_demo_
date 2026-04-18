'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--navy-100)] text-[var(--navy-900)] border-[var(--navy-200)]',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-amber-100 text-amber-800 border-amber-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      neutral: 'bg-[var(--neutral-100)] text-[var(--neutral-700)] border-[var(--neutral-200)]'
    };
    
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';