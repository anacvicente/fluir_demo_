'use client';

import { type ReactNode, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AccordionItem {
  /** Unique key */
  id: string;
  /** Header label */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional icon */
  icon?: ReactNode;
  /** Panel content */
  content: ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

export interface AccordionProps {
  /** Items to render */
  items: AccordionItem[];
  /** Allow multiple panels open at once */
  multiple?: boolean;
  /** Default open panels (by id) */
  defaultOpen?: string[];
  /** Visual variant */
  variant?: 'default' | 'bordered' | 'separated';
  /** Additional className */
  className?: string;
}

// ─── Accordion ───────────────────────────────────────────────────────────────

export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  variant = 'default',
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = useCallback((id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }, [multiple]);

  const variantStyles = {
    default: {
      container: '',
      item: 'border-b border-[var(--neutral-200)]',
    },
    bordered: {
      container: 'border border-[var(--neutral-200)] rounded-lg overflow-hidden',
      item: 'border-b border-[var(--neutral-200)] last:border-b-0',
    },
    separated: {
      container: 'space-y-2',
      item: 'border border-[var(--neutral-200)] rounded-lg overflow-hidden',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={clsx(styles.container, className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);

        return (
          <div key={item.id} className={styles.item}>
            {/* Header */}
            <button
              onClick={() => !item.disabled && toggle(item.id)}
              disabled={item.disabled}
              className={clsx(
                'flex items-center gap-3 w-full px-4 py-3.5 text-left transition-colors',
                item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[var(--neutral-50)] cursor-pointer',
                isOpen && 'bg-[var(--neutral-50)]'
              )}
            >
              {item.icon && (
                <span className="flex-shrink-0 text-[var(--neutral-400)]">{item.icon}</span>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-[var(--neutral-900)]">{item.title}</span>
                {item.subtitle && (
                  <span className="block text-xs text-[var(--neutral-500)] mt-0.5">{item.subtitle}</span>
                )}
              </div>
              <ChevronDown
                className={clsx(
                  'w-4 h-4 text-[var(--neutral-400)] transition-transform duration-200 flex-shrink-0',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Content */}
            <div
              className={clsx(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-4 pb-4 pt-1 text-sm text-[var(--neutral-700)]">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}