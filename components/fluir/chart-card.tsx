'use client';

import { type ReactNode } from 'react';
import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartCardProps {
  /** Card title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional right-side header actions (e.g., filter dropdown, period selector) */
  headerActions?: ReactNode;
  /** Chart content (e.g., recharts component) */
  children: ReactNode;
  /** Optional footer (e.g., legend, note) */
  footer?: ReactNode;
  /** Min height for chart area */
  minHeight?: number;
  /** Loading state */
  loading?: boolean;
  /** Additional className */
  className?: string;
}

export interface ChartLegendItem {
  /** Legend label */
  label: string;
  /** Color (CSS value) */
  color: string;
  /** Optional value */
  value?: string | number;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  /** Additional className */
  className?: string;
}

// ─── Chart Legend ────────────────────────────────────────────────────────────

export function ChartLegend({
  items,
  direction = 'horizontal',
  className,
}: ChartLegendProps) {
  return (
    <div
      className={clsx(
        'flex gap-4',
        direction === 'vertical' ? 'flex-col gap-2' : 'flex-wrap',
        className
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-[var(--neutral-600)]">{item.label}</span>
          {item.value !== undefined && (
            <span className="text-xs font-semibold text-[var(--neutral-800)]">{item.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Chart Card Loading ──────────────────────────────────────────────────────

function ChartCardSkeleton({ minHeight }: { minHeight: number }) {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-4 bg-[var(--neutral-200)] rounded w-32 mb-2" />
          <div className="h-3 bg-[var(--neutral-200)] rounded w-48" />
        </div>
        <div className="h-8 bg-[var(--neutral-200)] rounded w-24" />
      </div>
      <div
        className="bg-[var(--neutral-100)] rounded-lg"
        style={{ minHeight }}
      />
    </div>
  );
}

// ─── Chart Card ──────────────────────────────────────────────────────────────

export function ChartCard({
  title,
  subtitle,
  headerActions,
  children,
  footer,
  minHeight = 240,
  loading = false,
  className,
}: ChartCardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-[var(--neutral-200)] rounded-xl p-5',
        className
      )}
    >
      {loading ? (
        <ChartCardSkeleton minHeight={minHeight} />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h4 className="font-semibold text-[var(--neutral-900)]">{title}</h4>
              {subtitle && (
                <p className="text-xs text-[var(--neutral-500)] mt-0.5">{subtitle}</p>
              )}
            </div>
            {headerActions && (
              <div className="flex-shrink-0">{headerActions}</div>
            )}
          </div>

          {/* Chart area */}
          <div style={{ minHeight }}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="mt-4 pt-3 border-t border-[var(--neutral-100)]">
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
}