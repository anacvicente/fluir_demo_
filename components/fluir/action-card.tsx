'use client';

import { type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActionCardProps {
  /** Icon displayed at the top or left */
  icon?: ReactNode;
  /** Card title */
  title: string;
  /** Short description */
  description?: string;
  /** CTA button label */
  actionLabel: string;
  /** Click handler */
  onAction?: () => void;
  /** Visual variant */
  variant?: 'default' | 'highlighted' | 'subtle' | 'urgent';
  /** Layout direction */
  direction?: 'vertical' | 'horizontal';
  /** Optional badge/tag (e.g., "Novo", "Obrigatório") */
  badge?: string;
  /** Badge variant for color */
  badgeVariant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Disabled state */
  disabled?: boolean;
  /** Disabled reason tooltip text */
  disabledReason?: string;
  /** Additional className */
  className?: string;
}

// ─── Badge Colors ─────────────────────────────────────────────────────────────

const badgeColors: Record<string, string> = {
  default: 'bg-[var(--navy-100)] text-[var(--navy-800)]',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

// ─── Variant Styles ──────────────────────────────────────────────────────────

const variantStyles: Record<string, { container: string; button: string; iconBg: string }> = {
  default: {
    container: 'border border-[var(--neutral-200)] bg-white hover:border-[var(--navy-300)] hover:shadow-md',
    button: 'text-[var(--navy-700)] hover:text-[var(--navy-900)]',
    iconBg: 'bg-[var(--navy-50)] text-[var(--navy-600)]',
  },
  highlighted: {
    container: 'border-2 border-[var(--navy-300)] bg-[var(--navy-50)] hover:border-[var(--navy-500)] hover:shadow-md',
    button: 'bg-[var(--navy-700)] text-white hover:bg-[var(--navy-800)]',
    iconBg: 'bg-[var(--navy-200)] text-[var(--navy-700)]',
  },
  subtle: {
    container: 'border border-[var(--neutral-200)] bg-[var(--neutral-50)] hover:bg-white hover:border-[var(--neutral-300)]',
    button: 'text-[var(--neutral-600)] hover:text-[var(--neutral-800)]',
    iconBg: 'bg-[var(--neutral-200)] text-[var(--neutral-600)]',
  },
  urgent: {
    container: 'border-2 border-red-200 bg-red-50 hover:border-red-300 hover:shadow-md',
    button: 'bg-red-600 text-white hover:bg-red-700',
    iconBg: 'bg-red-100 text-red-600',
  },
};

// ─── Action Card ─────────────────────────────────────────────────────────────

export function ActionCard({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  direction = 'vertical',
  badge,
  badgeVariant = 'default',
  disabled = false,
  disabledReason,
  className,
}: ActionCardProps) {
  const styles = variantStyles[variant];

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      className={clsx(
        'rounded-lg p-5 transition-all duration-200 group relative',
        disabled ? 'opacity-50 cursor-not-allowed border border-[var(--neutral-200)] bg-[var(--neutral-50)]' : styles.container,
        isHorizontal ? 'flex items-center gap-4' : '',
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <span className={clsx(
          'absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
          badgeColors[badgeVariant]
        )}>
          {badge}
        </span>
      )}

      {/* Icon */}
      {icon && (
        <div className={clsx(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
          disabled ? 'bg-[var(--neutral-200)] text-[var(--neutral-400)]' : styles.iconBg,
          isHorizontal ? '' : 'mb-3'
        )}>
          {icon}
        </div>
      )}

      {/* Content */}
      <div className={clsx('flex-1', isHorizontal ? '' : '')}>
        <h4 className={clsx(
          'font-semibold text-sm',
          disabled ? 'text-[var(--neutral-400)]' : 'text-[var(--neutral-900)]'
        )}>
          {title}
        </h4>
        {description && (
          <p className={clsx(
            'text-xs mt-1',
            disabled ? 'text-[var(--neutral-400)]' : 'text-[var(--neutral-500)]'
          )}>
            {description}
          </p>
        )}
        {disabled && disabledReason && (
          <p className="text-xs text-[var(--neutral-400)] mt-1 italic">
            {disabledReason}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className={clsx(isHorizontal ? 'flex-shrink-0' : 'mt-4')}>
        {variant === 'highlighted' || variant === 'urgent' ? (
          <button
            disabled={disabled}
            onClick={onAction}
            className={clsx(
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors',
              disabled ? 'bg-[var(--neutral-200)] text-[var(--neutral-400)] cursor-not-allowed' : styles.button
            )}
          >
            {actionLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            disabled={disabled}
            onClick={onAction}
            className={clsx(
              'inline-flex items-center gap-1 text-xs font-semibold transition-colors group-hover:gap-2',
              disabled ? 'text-[var(--neutral-400)] cursor-not-allowed' : styles.button
            )}
          >
            {actionLabel}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}