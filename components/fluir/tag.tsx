'use client';

import { forwardRef, HTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TagVariant = 'default' | 'navy' | 'teal' | 'warning' | 'error' | 'success' | 'neutral';
export type TagSize = 'sm' | 'md' | 'lg';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Tag text content */
  label: string;
  /** Visual variant */
  variant?: TagVariant;
  /** Size */
  size?: TagSize;
  /** If provided, shows a remove (X) button */
  onRemove?: () => void;
  /** Optional leading icon */
  icon?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

// ─── Variant styles ──────────────────────────────────────────────────────────

const variantStyles: Record<TagVariant, string> = {
  default: 'bg-[var(--navy-100)] text-[var(--navy-900)] border-[var(--navy-200)]',
  navy: 'bg-[var(--navy-700)] text-white border-[var(--navy-800)]',
  teal: 'bg-[#E6F7F4] text-[#1B7A6A] border-[#B5E5DC]',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  neutral: 'bg-[var(--neutral-100)] text-[var(--neutral-700)] border-[var(--neutral-200)]',
};

const sizeStyles: Record<TagSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
};

const iconSizes: Record<TagSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

const closeSizes: Record<TagSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

// ─── Tag Component ───────────────────────────────────────────────────────────

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ label, variant = 'default', size = 'md', onRemove, icon, disabled = false, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center rounded-md border font-medium transition-all',
          variantStyles[variant],
          sizeStyles[size],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {icon && <span className={clsx('flex-shrink-0', iconSizes[size])}>{icon}</span>}
        <span className="truncate max-w-[200px]">{label}</span>
        {onRemove && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={clsx(
              'flex-shrink-0 rounded-sm transition-colors',
              'hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current',
              closeSizes[size]
            )}
            aria-label={`Remover ${label}`}
          >
            <X className="w-full h-full" />
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

// ─── Tag Group ───────────────────────────────────────────────────────────────

export interface TagGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Label above the group */
  label?: string;
  /** Max visible tags before "+N" collapse */
  maxVisible?: number;
  children: ReactNode;
}

export function TagGroup({ label, maxVisible, className, children, ...props }: TagGroupProps) {
  const childArray = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];
  const visible = maxVisible ? childArray.slice(0, maxVisible) : childArray;
  const remaining = maxVisible ? childArray.length - maxVisible : 0;

  return (
    <div className={clsx('flex flex-col gap-2', className)} {...props}>
      {label && (
        <span className="text-sm font-medium text-[var(--neutral-700)]">{label}</span>
      )}
      <div className="flex flex-wrap gap-2">
        {visible}
        {remaining > 0 && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--neutral-100)] text-[var(--neutral-600)] border border-[var(--neutral-200)]">
            +{remaining}
          </span>
        )}
      </div>
    </div>
  );
}