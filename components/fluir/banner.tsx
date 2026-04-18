'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { X, ShieldCheck, AlertTriangle, Info } from 'lucide-react';

export type BannerVariant = 'compliance' | 'warning' | 'info';

interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BannerVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = 'info', dismissible, onDismiss, action, className, children, ...props }, ref) => {
    const variants = {
      compliance: {
        container: 'bg-[var(--navy-900)] text-white border-[var(--navy-700)]',
        icon: <ShieldCheck className="w-5 h-5" />,
        button: 'bg-white text-[var(--navy-900)] hover:bg-[var(--navy-50)]'
      },
      warning: {
        container: 'bg-amber-500 text-white border-amber-600',
        icon: <AlertTriangle className="w-5 h-5" />,
        button: 'bg-white text-amber-900 hover:bg-amber-50'
      },
      info: {
        container: 'bg-blue-600 text-white border-blue-700',
        icon: <Info className="w-5 h-5" />,
        button: 'bg-white text-blue-900 hover:bg-blue-50'
      }
    };

    const config = variants[variant];

    return (
      <div
        ref={ref}
        className={clsx(
          'border-b-2 px-6 py-3',
          config.container,
          className
        )}
        role="banner"
        {...props}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {config.icon}
            <p className="text-sm font-medium">{children}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {action && (
              <button
                onClick={action.onClick}
                className={clsx(
                  'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                  config.button
                )}
              >
                {action.label}
              </button>
            )}
            {dismissible && onDismiss && (
              <button
                onClick={onDismiss}
                className="opacity-80 hover:opacity-100 transition-opacity"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Banner.displayName = 'Banner';