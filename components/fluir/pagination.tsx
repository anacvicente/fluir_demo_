'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaginationProps {
  /** Current page (1-based) */
  page: number;
  /** Total number of items */
  totalItems: number;
  /** Items per page */
  pageSize: number;
  /** Called when page changes */
  onPageChange: (page: number) => void;
  /** Show "Mostrando X-Y de Z" info */
  showInfo?: boolean;
  /** Show first/last page buttons */
  showEdges?: boolean;
  /** Visual size */
  size?: 'sm' | 'md';
  /** Additional className */
  className?: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export function Pagination({
  page,
  totalItems,
  pageSize,
  onPageChange,
  showInfo = true,
  showEdges = false,
  size = 'md',
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display
  const getPages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      let rangeStart = Math.max(2, currentPage - 1);
      let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        rangeEnd = Math.min(maxVisible, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        rangeStart = Math.max(2, totalPages - maxVisible + 1);
      }

      if (rangeStart > 2) pages.push('ellipsis');
      for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
      if (rangeEnd < totalPages - 1) pages.push('ellipsis');

      pages.push(totalPages);
    }

    return pages;
  };

  const sizeStyles = {
    sm: { btn: 'w-7 h-7 text-xs', nav: 'h-7 px-1.5', info: 'text-xs' },
    md: { btn: 'w-8 h-8 text-sm', nav: 'h-8 px-2', info: 'text-sm' },
  };
  const s = sizeStyles[size];

  const PageButton = ({ p, isCurrent }: { p: number; isCurrent: boolean }) => (
    <button
      onClick={() => onPageChange(p)}
      className={clsx(
        'rounded-md font-medium transition-colors',
        s.btn,
        isCurrent
          ? 'bg-[var(--navy-700)] text-white'
          : 'text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] hover:text-[var(--neutral-900)]'
      )}
    >
      {p}
    </button>
  );

  const NavButton = ({
    onClick,
    disabled,
    children,
  }: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'flex items-center justify-center rounded-md transition-colors',
        s.nav,
        disabled
          ? 'text-[var(--neutral-300)] cursor-not-allowed'
          : 'text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] hover:text-[var(--neutral-900)]'
      )}
    >
      {children}
    </button>
  );

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className={clsx('flex items-center justify-between gap-4', className)}>
      {/* Info */}
      {showInfo && (
        <p className={clsx('text-[var(--neutral-500)]', s.info)}>
          Mostrando <span className="font-medium text-[var(--neutral-700)]">{start}</span>–
          <span className="font-medium text-[var(--neutral-700)]">{end}</span> de{' '}
          <span className="font-medium text-[var(--neutral-700)]">{totalItems}</span>
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1">
        {showEdges && (
          <NavButton onClick={() => onPageChange(1)} disabled={currentPage === 1}>
            <ChevronsLeft className={iconSize} />
          </NavButton>
        )}
        <NavButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className={iconSize} />
        </NavButton>

        {getPages().map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e-${i}`} className={clsx('flex items-center justify-center text-[var(--neutral-400)]', s.btn)}>
              …
            </span>
          ) : (
            <PageButton key={p} p={p} isCurrent={p === currentPage} />
          )
        )}

        <NavButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <ChevronRight className={iconSize} />
        </NavButton>
        {showEdges && (
          <NavButton onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
            <ChevronsRight className={iconSize} />
          </NavButton>
        )}
      </div>
    </div>
  );
}