'use client';

import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface StatCardProps {
  /** Label above the value */
  label: string;
  /** Main value (large) */
  value: string | number;
  /** Optional unit/suffix (e.g., '%', 'dias') */
  unit?: string;
  /** Trend information */
  trend?: {
    value: string;
    direction: TrendDirection;
    /** Override: is "up" good or bad? Default: up = good */
    invertColor?: boolean;
  };
  /** Optional icon (left of label) */
  icon?: ReactNode;
  /** Optional footer text */
  footer?: string;
  /** Visual variant */
  variant?: 'default' | 'highlight' | 'muted';
  /** Loading state */
  loading?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional class */
  className?: string;
}

// ─── Trend Component ─────────────────────────────────────────────────────────

function TrendIndicator({ value, direction, invertColor }: {
  value: string;
  direction: TrendDirection;
  invertColor?: boolean;
}) {
  const isPositive = direction === 'up';
  const isNegative = direction === 'down';
  const isNeutral = direction === 'neutral';

  // Default: up = good (green), down = bad (red). Invert flips this.
  let colorClass = 'text-[var(--neutral-500)]';
  if (!isNeutral) {
    const isGood = invertColor ? isNegative : isPositive;
    colorClass = isGood ? 'text-green-600' : 'text-red-600';
  }

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${colorClass}`}>
      <Icon className="w-3.5 h-3.5" />
      {value}
    </span>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="border border-[var(--neutral-200)] rounded-lg bg-white p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 bg-[var(--neutral-200)] rounded" />
        <div className="h-3 bg-[var(--neutral-200)] rounded w-20" />
      </div>
      <div className="h-8 bg-[var(--neutral-200)] rounded w-16 mb-2" />
      <div className="h-3 bg-[var(--neutral-200)] rounded w-12" />
    </div>
  );
}

// ─── StatCard ────────────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  unit,
  trend,
  icon,
  footer,
  variant = 'default',
  loading = false,
  onClick,
  className = '',
}: StatCardProps) {
  if (loading) return <StatCardSkeleton />;

  const variantStyles = {
    default: 'border-[var(--neutral-200)] bg-white',
    highlight: 'border-[var(--navy-200)] bg-[var(--navy-50)]',
    muted: 'border-[var(--neutral-200)] bg-[var(--neutral-50)]',
  };

  return (
    <div
      className={`
        border rounded-lg p-4 transition-all
        ${variantStyles[variant]}
        ${onClick ? 'cursor-pointer hover:shadow-md hover:border-[var(--navy-300)]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Label + Icon */}
      <div className="flex items-center gap-2 mb-1">
        {icon && (
          <span className="text-[var(--neutral-400)] flex-shrink-0">{icon}</span>
        )}
        <span className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wide truncate">
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-bold text-[var(--neutral-900)]">{value}</span>
        {unit && (
          <span className="text-sm font-medium text-[var(--neutral-500)]">{unit}</span>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <TrendIndicator
          value={trend.value}
          direction={trend.direction}
          invertColor={trend.invertColor}
        />
      )}

      {/* Footer */}
      {footer && (
        <p className="text-xs text-[var(--neutral-500)] mt-1.5">{footer}</p>
      )}
    </div>
  );
}