'use client';

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';
import { Inbox, Search, Lock, AlertTriangle, Rocket, LucideIcon } from 'lucide-react';
import { Button } from './button';

export type EmptyStateVariant = 'empty' | 'no-results' | 'blocked' | 'error' | 'first-time';

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  variant?: EmptyStateVariant;
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ variant = 'empty', icon, title, description, action, secondaryAction, compact = false, className, children, ...props }, ref) => {

    const variantConfig: Record<EmptyStateVariant, { icon: ReactNode; iconBg: string }> = {
      'empty': {
        icon: <Inbox className="w-8 h-8 text-[var(--neutral-400)]" />,
        iconBg: 'bg-[var(--neutral-100)]'
      },
      'no-results': {
        icon: <Search className="w-8 h-8 text-[var(--neutral-400)]" />,
        iconBg: 'bg-[var(--neutral-100)]'
      },
      'blocked': {
        icon: <Lock className="w-8 h-8 text-amber-500" />,
        iconBg: 'bg-amber-50'
      },
      'error': {
        icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
        iconBg: 'bg-red-50'
      },
      'first-time': {
        icon: <Rocket className="w-8 h-8 text-[var(--navy-600)]" />,
        iconBg: 'bg-[var(--navy-50)]'
      }
    };

    const config = variantConfig[variant];

    return (
      <div
        ref={ref}
        className={clsx(
          'flex flex-col items-center text-center',
          compact ? 'py-8 px-4' : 'py-16 px-6',
          className
        )}
        {...props}
      >
        {/* Icon */}
        <div className={clsx(
          'rounded-full flex items-center justify-center mb-5',
          compact ? 'w-14 h-14' : 'w-16 h-16',
          config.iconBg
        )}>
          {icon || config.icon}
        </div>

        {/* Title */}
        <h3 className={clsx(
          'font-semibold text-[var(--neutral-900)] mb-2',
          compact ? 'text-base' : 'text-lg'
        )}>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className={clsx(
            'text-[var(--neutral-500)] max-w-md mb-6',
            compact ? 'text-xs' : 'text-sm'
          )}>
            {description}
          </p>
        )}

        {/* Custom content */}
        {children && (
          <div className="mb-6 w-full max-w-md">
            {children}
          </div>
        )}

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex items-center gap-3">
            {action && (
              <Button
                variant={action.variant || 'primary'}
                size={compact ? 'sm' : 'md'}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="ghost"
                size={compact ? 'sm' : 'md'}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';