'use client';

import { type ReactNode } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: ReactNode;
  /** Click handler (if omitted, item is non-interactive / current) */
  onClick?: () => void;
  /** Href (optional, for semantics) */
  href?: string;
}

export interface BreadcrumbProps {
  /** Breadcrumb items (last one = current page) */
  items: BreadcrumbItem[];
  /** Separator style */
  separator?: 'chevron' | 'slash';
  /** Show home icon for first item */
  showHome?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Additional className */
  className?: string;
}

// ─── Breadcrumb ──────────────────────────────────────────────────────────────

export function Breadcrumb({
  items,
  separator = 'chevron',
  showHome = false,
  size = 'sm',
  className,
}: BreadcrumbProps) {
  const sizeStyles = {
    sm: { text: 'text-xs', icon: 'w-3 h-3', sep: 'w-3 h-3' },
    md: { text: 'text-sm', icon: 'w-3.5 h-3.5', sep: 'w-3.5 h-3.5' },
  };
  const s = sizeStyles[size];

  const Separator = () => (
    separator === 'chevron'
      ? <ChevronRight className={clsx(s.sep, 'text-[var(--neutral-400)] flex-shrink-0')} />
      : <span className={clsx(s.text, 'text-[var(--neutral-400)] mx-0.5')}>/</span>
  );

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const isFirst = i === 0;

          return (
            <li key={i} className="flex items-center gap-1.5">
              {/* Separator (not before first item) */}
              {i > 0 && <Separator />}

              {/* Item */}
              {isLast ? (
                // Current page (non-interactive)
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 font-medium text-[var(--neutral-900)]',
                    s.text
                  )}
                  aria-current="page"
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                // Clickable ancestor
                <button
                  onClick={item.onClick}
                  className={clsx(
                    'inline-flex items-center gap-1 text-[var(--neutral-500)] hover:text-[var(--navy-700)] transition-colors',
                    s.text
                  )}
                >
                  {isFirst && showHome ? (
                    <Home className={clsx(s.icon, 'flex-shrink-0')} />
                  ) : item.icon ? (
                    <span className="flex-shrink-0">{item.icon}</span>
                  ) : null}
                  {(!isFirst || !showHome || item.label !== 'Início') && item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}