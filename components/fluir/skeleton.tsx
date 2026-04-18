'use client';

import { type HTMLAttributes } from 'react';
import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Shape of the skeleton */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  /** Width (CSS value or number for px) */
  width?: string | number;
  /** Height (CSS value or number for px) */
  height?: string | number;
  /** For text variant: number of lines to render */
  lines?: number;
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'none';
}

export interface SkeletonGroupProps {
  /** Preset layout pattern */
  layout: 'card' | 'table-row' | 'list-item' | 'stat-card' | 'profile' | 'paragraph';
  /** Number of repetitions */
  count?: number;
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'none';
  /** Additional class */
  className?: string;
}

// ─── Base Skeleton ───────────────────────────────────────────────────────────

export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  animation = 'pulse',
  className,
  style,
  ...props
}: SkeletonProps) {
  const animationClass = animation === 'pulse'
    ? 'animate-pulse'
    : animation === 'wave'
      ? 'skeleton-wave'
      : '';

  const baseClass = 'bg-[var(--neutral-200)]';

  const variantStyles: Record<string, string> = {
    text: 'rounded h-3',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const resolveSize = (val: string | number | undefined) =>
    typeof val === 'number' ? `${val}px` : val;

  // Text with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={clsx('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(baseClass, animationClass, variantStyles.text)}
            style={{
              width: i === lines - 1 ? '75%' : '100%', // last line shorter
              ...style,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(baseClass, animationClass, variantStyles[variant], className)}
      style={{
        width: resolveSize(width) || (variant === 'circular' ? '40px' : '100%'),
        height: resolveSize(height) || (variant === 'circular' ? '40px' : variant === 'text' ? '12px' : '80px'),
        ...style,
      }}
      {...props}
    />
  );
}

// ─── Skeleton Group (Preset Layouts) ─────────────────────────────────────────

export function SkeletonGroup({
  layout,
  count = 1,
  animation = 'pulse',
  className,
}: SkeletonGroupProps) {
  const items = Array.from({ length: count });

  const layouts: Record<string, () => JSX.Element> = {
    'card': () => (
      <div className="border border-[var(--neutral-200)] rounded-lg bg-white p-4 space-y-3">
        <Skeleton variant="rounded" height={120} animation={animation} />
        <Skeleton variant="text" width="60%" animation={animation} />
        <Skeleton variant="text" lines={2} animation={animation} />
        <div className="flex gap-2 pt-1">
          <Skeleton variant="rounded" width={80} height={28} animation={animation} />
          <Skeleton variant="rounded" width={60} height={28} animation={animation} />
        </div>
      </div>
    ),

    'table-row': () => (
      <div className="flex items-center gap-4 py-3 px-4 border-b border-[var(--neutral-100)]">
        <Skeleton variant="text" width="25%" animation={animation} />
        <Skeleton variant="text" width="30%" animation={animation} />
        <Skeleton variant="text" width="15%" animation={animation} />
        <Skeleton variant="rounded" width={64} height={22} animation={animation} />
      </div>
    ),

    'list-item': () => (
      <div className="flex items-center gap-3 py-3">
        <Skeleton variant="circular" width={36} height={36} animation={animation} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" animation={animation} />
          <Skeleton variant="text" width="70%" animation={animation} />
        </div>
      </div>
    ),

    'stat-card': () => (
      <div className="border border-[var(--neutral-200)] rounded-lg bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton variant="rounded" width={16} height={16} animation={animation} />
          <Skeleton variant="text" width={80} animation={animation} />
        </div>
        <Skeleton variant="text" width={64} height={28} animation={animation} />
        <div className="mt-2">
          <Skeleton variant="text" width={96} animation={animation} />
        </div>
      </div>
    ),

    'profile': () => (
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={56} height={56} animation={animation} />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton variant="text" width="35%" height={16} animation={animation} />
          <Skeleton variant="text" width="55%" animation={animation} />
          <Skeleton variant="text" width="25%" animation={animation} />
        </div>
      </div>
    ),

    'paragraph': () => (
      <div className="space-y-2">
        <Skeleton variant="text" width="45%" height={18} animation={animation} />
        <Skeleton variant="text" lines={4} animation={animation} />
      </div>
    ),
  };

  const renderLayout = layouts[layout] || layouts['card'];

  if (count === 1) {
    return <div className={className}>{renderLayout()}</div>;
  }

  return (
    <div className={clsx('space-y-3', className)}>
      {items.map((_, i) => (
        <div key={i}>{renderLayout()}</div>
      ))}
    </div>
  );
}