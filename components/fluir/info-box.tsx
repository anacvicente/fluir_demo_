'use client';

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';
import { FileCheck, BookOpen, Scale, AlertTriangle } from 'lucide-react';

export type InfoBoxVariant = 'documentation' | 'methodology' | 'legal' | 'risk';

interface InfoBoxProps extends HTMLAttributes<HTMLDivElement> {
  variant?: InfoBoxVariant;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
}

export const InfoBox = forwardRef<HTMLDivElement, InfoBoxProps>(
  ({ variant = 'documentation', title, subtitle, icon, badge, className, children, ...props }, ref) => {
    const variants = {
      documentation: {
        container: 'bg-white border-[var(--neutral-200)]',
        header: 'bg-[var(--neutral-50)]',
        icon: <FileCheck className="w-6 h-6 text-[var(--navy-700)]" />,
        badge: 'bg-[var(--navy-100)] text-[var(--navy-900)]'
      },
      methodology: {
        container: 'bg-white border-indigo-200',
        header: 'bg-indigo-50',
        icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
        badge: 'bg-indigo-100 text-indigo-900'
      },
      legal: {
        container: 'bg-white border-purple-200',
        header: 'bg-purple-50',
        icon: <Scale className="w-6 h-6 text-purple-600" />,
        badge: 'bg-purple-100 text-purple-900'
      },
      risk: {
        container: 'bg-white border-amber-200',
        header: 'bg-amber-50',
        icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
        badge: 'bg-amber-100 text-amber-900'
      }
    };

    const config = variants[variant];

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg border-2 overflow-hidden',
          config.container,
          className
        )}
        {...props}
      >
        <div className={clsx('px-5 py-4 flex items-start gap-4', config.header)}>
          <div className="flex-shrink-0">
            {icon || config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--neutral-900)] mb-1">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-sm text-[var(--neutral-600)]">
                    {subtitle}
                  </p>
                )}
              </div>
              {badge && (
                <span className={clsx(
                  'px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap',
                  config.badge
                )}>
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>
        {children && (
          <div className="px-5 py-4 text-sm text-[var(--neutral-700)] leading-relaxed">
            {children}
          </div>
        )}
      </div>
    );
  }
);

InfoBox.displayName = 'InfoBox';