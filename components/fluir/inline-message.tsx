'use client';

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, XCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export type InlineMessageVariant = 'success' | 'error' | 'warning' | 'info';

interface InlineMessageProps extends HTMLAttributes<HTMLDivElement> {
  variant: InlineMessageVariant;
  message: string;
  icon?: ReactNode;
  compact?: boolean;
}

export const InlineMessage = forwardRef<HTMLDivElement, InlineMessageProps>(
  ({ variant, message, icon, compact = false, className, ...props }, ref) => {
    const variants = {
      success: {
        container: 'bg-green-50 text-green-800 border-green-300',
        icon: <CheckCircle2 className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
      },
      error: {
        container: 'bg-red-50 text-red-800 border-red-300',
        icon: <XCircle className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
      },
      warning: {
        container: 'bg-amber-50 text-amber-800 border-amber-300',
        icon: <AlertTriangle className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
      },
      info: {
        container: 'bg-blue-50 text-blue-800 border-blue-300',
        icon: <Info className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
      }
    };

    const config = variants[variant];

    return (
      <div
        ref={ref}
        className={clsx(
          'flex items-start gap-2 rounded-lg border',
          compact ? 'p-2' : 'p-3',
          config.container,
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex-shrink-0 mt-0.5">
          {icon || config.icon}
        </div>
        <p className={clsx('flex-1', compact ? 'text-xs' : 'text-sm')}>
          {message}
        </p>
      </div>
    );
  }
);

InlineMessage.displayName = 'InlineMessage';

// Variante para uso em formulários
interface FormFieldMessageProps extends HTMLAttributes<HTMLDivElement> {
  type: 'error' | 'success' | 'helper';
  message: string;
}

export const FormFieldMessage = forwardRef<HTMLDivElement, FormFieldMessageProps>(
  ({ type, message, className, ...props }, ref) => {
    const types = {
      error: {
        icon: <AlertCircle className="w-4 h-4" />,
        className: 'text-red-600'
      },
      success: {
        icon: <CheckCircle2 className="w-4 h-4" />,
        className: 'text-green-600'
      },
      helper: {
        icon: <Info className="w-4 h-4" />,
        className: 'text-[var(--neutral-600)]'
      }
    };

    const config = types[type];

    return (
      <div
        ref={ref}
        className={clsx('flex items-start gap-1.5 mt-1.5', config.className, className)}
        {...props}
      >
        {config.icon}
        <span className="text-sm">{message}</span>
      </div>
    );
  }
);

FormFieldMessage.displayName = 'FormFieldMessage';