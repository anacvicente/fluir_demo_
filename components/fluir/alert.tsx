'use client';

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';
import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  FileWarning,
  Scale,
  BookOpen,
  X
} from 'lucide-react';

export type AlertVariant = 'info' | 'warning' | 'error' | 'success' | 'compliance' | 'legal' | 'methodology';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  icon?: ReactNode;
  noIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, icon, noIcon, dismissible, onDismiss, className, children, ...props }, ref) => {
    const variants = {
      info: {
        container: 'bg-[#F2F0F6] border-[#DEDAE8] text-[var(--navy-900)]',
        icon: <Info className="w-5 h-5 text-[var(--navy-600)]" />,
        title: 'text-[var(--navy-900)]'
      },
      warning: {
        container: 'bg-amber-50 border-amber-300 text-amber-900',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        title: 'text-amber-900'
      },
      error: {
        container: 'bg-red-50 border-red-300 text-red-900',
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        title: 'text-red-900'
      },
      success: {
        container: 'bg-green-50 border-green-200 text-green-900',
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
        title: 'text-green-900'
      },
      compliance: {
        container: 'bg-[var(--navy-50)] border-[var(--navy-300)] text-[var(--navy-900)]',
        icon: <ShieldAlert className="w-5 h-5 text-[var(--navy-700)]" />,
        title: 'text-[var(--navy-900)]'
      },
      legal: {
        container: 'bg-purple-50 border-purple-200 text-purple-900',
        icon: <Scale className="w-5 h-5 text-purple-600" />,
        title: 'text-purple-900'
      },
      methodology: {
        container: 'bg-indigo-50 border-indigo-200 text-indigo-900',
        icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
        title: 'text-indigo-900'
      }
    };

    const config = variants[variant];

    return (
      <div
        ref={ref}
        className={clsx(
          'relative rounded-lg border-2 p-4',
          config.container,
          className
        )}
        role="alert"
        {...props}
      >
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Fechar"
          >
            FECHAR <X className="w-3.5 h-3.5" />
          </button>
        )}
        <div className="flex gap-3">
          {!noIcon && (
            <div className="flex-shrink-0 mt-0.5">
              {icon || config.icon}
            </div>
          )}
          <div className={clsx('flex-1 min-w-0', dismissible && onDismiss && 'pr-20')}>
            {title && (
              <h4 className={clsx('font-semibold mb-1', config.title)}>
                {title}
              </h4>
            )}
            <div className="text-sm leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';