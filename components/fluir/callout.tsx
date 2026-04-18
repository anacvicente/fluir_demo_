'use client';

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';
import { LightbulbIcon, FileText, Scale, BookOpen, AlertCircle } from 'lucide-react';

export type CalloutVariant = 'note' | 'tip' | 'legal' | 'methodology' | 'important' | 'navy';

interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant;
  title?: string;
  icon?: ReactNode;
}

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ variant = 'note', title, icon, className, children, ...props }, ref) => {
    const variants = {
      note: {
        container: 'bg-[var(--neutral-50)] border-l-[var(--neutral-400)]',
        icon: <FileText className="w-5 h-5 text-[var(--neutral-600)]" />,
        title: 'text-[var(--neutral-900)]'
      },
      tip: {
        container: 'bg-green-50 border-l-green-500',
        icon: <LightbulbIcon className="w-5 h-5 text-green-600" />,
        title: 'text-green-900'
      },
      legal: {
        container: 'bg-purple-50 border-l-purple-500',
        icon: <Scale className="w-5 h-5 text-purple-600" />,
        title: 'text-purple-900'
      },
      methodology: {
        container: 'bg-indigo-50 border-l-indigo-500',
        icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
        title: 'text-indigo-900'
      },
      important: {
        container: 'bg-amber-50 border-l-amber-500',
        icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
        title: 'text-amber-900'
      },
      navy: {
        container: 'bg-[var(--navy-50)] border-l-[var(--navy-700)]',
        icon: <FileText className="w-5 h-5 text-[var(--navy-700)]" />,
        title: 'text-[var(--navy-900)]'
      }
    };

    const config = variants[variant] || variants.note;

    return (
      <div
        ref={ref}
        className={clsx(
          'border-l-4 p-4 rounded-r-lg',
          config.container,
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {icon || config.icon}
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={clsx('font-semibold mb-2', config.title)}>
                {title}
              </h4>
            )}
            <div className="text-sm text-[var(--neutral-700)] leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Callout.displayName = 'Callout';