'use client';

import { type ReactNode, useEffect, useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DrawerProps {
  /** Whether the drawer is open */
  open: boolean;
  /** Called when the drawer should close */
  onClose: () => void;
  /** Header title */
  title?: string;
  /** Header subtitle */
  subtitle?: string;
  /** Main content */
  children: ReactNode;
  /** Footer content (e.g., action buttons) */
  footer?: ReactNode;
  /** Width of the drawer */
  width?: 'sm' | 'md' | 'lg' | 'xl';
  /** Side to open from */
  side?: 'right' | 'left';
  /** Show overlay backdrop */
  overlay?: boolean;
  /** Offset from the right edge in px (for stacked drawers) */
  offset?: number;
  /** Content rendered between header and body — never scrolls */
  stickyContent?: ReactNode;
  /** Additional className for the panel */
  className?: string;
}

// ─── Width Map ───────────────────────────────────────────────────────────────

const widthMap = {
  sm: 320,
  md: 420,
  lg: 560,
  xl: 720,
};

// ─── Drawer ──────────────────────────────────────────────────────────────────

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'md',
  side = 'right',
  overlay = true,
  offset = 0,
  stickyContent,
  className,
}: DrawerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black/40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      {isMobile ? (
        /* ── Mobile: bottom sheet ── */
        <div
          className={clsx(
            'absolute bottom-0 left-0 right-0 flex flex-col bg-white shadow-2xl rounded-t-2xl max-h-[85vh] animate-in slide-in-from-bottom duration-200',
            className,
          )}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-[var(--neutral-200)]" />
          </div>

          {/* Header */}
          {(title || subtitle) && (
            <div className="flex items-start justify-between gap-4 px-6 py-3 border-b border-[var(--neutral-200)] flex-shrink-0">
              <div className="min-w-0">
                {title && (
                  <h3 className="font-semibold text-[var(--neutral-900)] truncate">{title}</h3>
                )}
                {subtitle && (
                  <p className="text-sm text-[var(--neutral-500)] mt-0.5 truncate">{subtitle}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-md text-[var(--neutral-400)] hover:text-[var(--neutral-700)] hover:bg-[var(--neutral-100)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Sticky content */}
          {stickyContent && (
            <div className="flex-shrink-0 bg-white border-b border-[var(--neutral-200)] px-6 py-3">
              {stickyContent}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex-shrink-0 px-6 py-4 border-t border-[var(--neutral-200)] bg-[var(--neutral-50)]">
              {footer}
            </div>
          )}
        </div>
      ) : (
        /* ── Desktop: side panel ── */
        <div
          className={clsx(
            'absolute top-0 bottom-0 flex flex-col bg-white shadow-2xl border-[var(--neutral-200)] max-w-full',
            side === 'right' ? 'border-l animate-in slide-in-from-right' : 'border-r animate-in slide-in-from-left',
            className,
          )}
          style={side === 'right'
            ? { right: offset, width: widthMap[width] }
            : { left: 0, width: widthMap[width] }
          }
        >
          {/* Header */}
          {(title || subtitle) && (
            <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-[var(--neutral-200)] flex-shrink-0">
              <div className="min-w-0">
                {title && (
                  <h3 className="font-semibold text-[var(--neutral-900)] truncate">{title}</h3>
                )}
                {subtitle && (
                  <p className="text-sm text-[var(--neutral-500)] mt-0.5 truncate">{subtitle}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-md text-[var(--neutral-400)] hover:text-[var(--neutral-700)] hover:bg-[var(--neutral-100)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Sticky content */}
          {stickyContent && (
            <div className="flex-shrink-0 bg-white border-b border-[var(--neutral-200)] px-6 py-4">
              {stickyContent}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex-shrink-0 px-6 py-4 border-t border-[var(--neutral-200)] bg-[var(--neutral-50)]">
              {footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
