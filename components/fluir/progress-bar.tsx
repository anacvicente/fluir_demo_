'use client';

import { type ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProgressVariant = 'default' | 'auto' | 'success' | 'warning' | 'error' | 'info';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  /** Current value (0–100) */
  value: number;
  /** Max value (default 100) */
  max?: number;
  /** Visual variant. 'auto' picks color based on thresholds */
  variant?: ProgressVariant;
  /** Size */
  size?: ProgressSize;
  /** Label above the bar */
  label?: string;
  /** Show percentage text */
  showValue?: boolean;
  /** Custom value formatter (e.g., '342/407') */
  valueFormatter?: (value: number, max: number) => string;
  /** Thresholds for 'auto' variant (defaults: green ≥80, yellow ≥60, red <60) */
  thresholds?: { green: number; yellow: number };
  /** Animated fill */
  animated?: boolean;
  /** Striped effect */
  striped?: boolean;
  /** Additional class */
  className?: string;
}

// ─── Color Logic ─────────────────────────────────────────────────────────────

function getBarColor(variant: ProgressVariant, percentage: number, thresholds: { green: number; yellow: number }): string {
  if (variant === 'auto') {
    if (percentage >= thresholds.green) return 'bg-green-500';
    if (percentage >= thresholds.yellow) return 'bg-amber-500';
    return 'bg-red-500';
  }

  const colorMap: Record<ProgressVariant, string> = {
    default: 'bg-[var(--navy-600)]',
    auto: '', // handled above
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return colorMap[variant];
}

function getTextColor(variant: ProgressVariant, percentage: number, thresholds: { green: number; yellow: number }): string {
  if (variant === 'auto') {
    if (percentage >= thresholds.green) return 'text-green-700';
    if (percentage >= thresholds.yellow) return 'text-amber-700';
    return 'text-red-700';
  }

  const colorMap: Record<ProgressVariant, string> = {
    default: 'text-[var(--navy-700)]',
    auto: '',
    success: 'text-green-700',
    warning: 'text-amber-700',
    error: 'text-red-700',
    info: 'text-blue-700',
  };

  return colorMap[variant];
}

// ─── Size Config ─────────────────────────────────────────────────────────────

const sizeConfig: Record<ProgressSize, { bar: string; text: string }> = {
  sm: { bar: 'h-1.5', text: 'text-xs' },
  md: { bar: 'h-2.5', text: 'text-sm' },
  lg: { bar: 'h-4', text: 'text-sm' },
};

// ─── ProgressBar ─────────────────────────────────────────────────────────────

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  label,
  showValue = true,
  valueFormatter,
  thresholds = { green: 80, yellow: 60 },
  animated = true,
  striped = false,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = getBarColor(variant, percentage, thresholds);
  const textColor = getTextColor(variant, percentage, thresholds);
  const sizeStyles = sizeConfig[size];

  const displayValue = valueFormatter
    ? valueFormatter(value, max)
    : `${Math.round(percentage)}%`;

  return (
    <div className={className}>
      {/* Header: label + value */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium text-[var(--neutral-700)]">{label}</span>
          )}
          {showValue && (
            <span className={`${sizeStyles.text} font-semibold ${textColor}`}>
              {displayValue}
            </span>
          )}
        </div>
      )}

      {/* Bar track */}
      <div className={`${sizeStyles.bar} bg-[var(--neutral-200)] rounded-full overflow-hidden`}>
        <div
          className={`
            h-full rounded-full
            ${barColor}
            ${animated ? 'transition-all duration-500 ease-out' : ''}
            ${striped ? 'bg-stripes' : ''}
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

// ─── ProgressBar Group (for multiple bars comparison) ────────────────────────

export interface ProgressItemProps {
  label: string;
  value: number;
  max?: number;
  variant?: ProgressVariant;
  detail?: string;
}

export function ProgressGroup({
  items,
  size = 'sm',
  className = '',
}: {
  items: ProgressItemProps[];
  size?: ProgressSize;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[var(--neutral-700)]">{item.label}</span>
            <div className="flex items-center gap-2">
              {item.detail && (
                <span className="text-xs text-[var(--neutral-500)]">{item.detail}</span>
              )}
              <span className="text-xs font-semibold text-[var(--neutral-700)]">
                {Math.round((item.value / (item.max || 100)) * 100)}%
              </span>
            </div>
          </div>
          <ProgressBar
            value={item.value}
            max={item.max}
            variant={item.variant || 'auto'}
            size={size}
            showValue={false}
          />
        </div>
      ))}
    </div>
  );
}