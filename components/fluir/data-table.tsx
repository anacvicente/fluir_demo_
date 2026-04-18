'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  header: string;
  /** Render custom cell content */
  render?: (row: T) => ReactNode;
  /** Enable sorting on this column */
  sortable?: boolean;
  /** Alignment */
  align?: 'left' | 'center' | 'right';
  /** Column width (Tailwind or CSS) */
  width?: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Unique key extractor */
  rowKey: (row: T) => string;
  /** Loading state */
  loading?: boolean;
  /** Empty state content */
  emptyState?: ReactNode;
  /** Clickable rows */
  onRowClick?: (row: T) => void;
  /** Controlled sort */
  sort?: SortState | null;
  onSortChange?: (sort: SortState) => void;
  /** Sticky header */
  stickyHeader?: boolean;
  /** Compact rows */
  compact?: boolean;
  /** Striped rows */
  striped?: boolean;
  /** Max height with scroll */
  maxHeight?: string;
  /** Additional class */
  className?: string;
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === 'asc') return <ChevronUp className="w-3.5 h-3.5" />;
  if (direction === 'desc') return <ChevronDown className="w-3.5 h-3.5" />;
  return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
}

// ─── Loading Rows ─────────────────────────────────────────────────────────────

function LoadingRows({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx}>
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx} className="px-4 py-3">
              <div className="h-4 bg-[var(--neutral-200)] rounded animate-pulse" 
                   style={{ width: `${50 + Math.random() * 40}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyState,
  onRowClick,
  sort: controlledSort,
  onSortChange,
  stickyHeader = true,
  compact = false,
  striped = false,
  maxHeight,
  className = '',
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<SortState | null>(null);

  const isControlled = controlledSort !== undefined;
  const currentSort = isControlled ? controlledSort : internalSort;

  const handleSort = (key: string) => {
    const col = columns.find(c => c.key === key);
    if (!col?.sortable) return;

    let newDirection: SortDirection = 'asc';
    if (currentSort?.key === key) {
      if (currentSort.direction === 'asc') newDirection = 'desc';
      else if (currentSort.direction === 'desc') newDirection = null;
    }

    const newSort: SortState = { key, direction: newDirection };
    if (isControlled) {
      onSortChange?.(newSort);
    } else {
      setInternalSort(newDirection ? newSort : null);
    }
  };

  // Internal sort (only when uncontrolled)
  const sortedData = useMemo(() => {
    if (isControlled || !internalSort?.direction) return data;
    const col = columns.find(c => c.key === internalSort.key);
    if (!col) return data;

    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[internalSort.key];
      const bVal = (b as Record<string, unknown>)[internalSort.key];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let cmp = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal), 'pt-BR', { sensitivity: 'base' });
      }
      return internalSort.direction === 'desc' ? -cmp : cmp;
    });
  }, [data, internalSort, isControlled, columns]);

  const displayData = isControlled ? data : sortedData;
  const cellPadding = compact ? 'px-4 py-2' : 'px-4 py-3';

  const alignClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  return (
    <div
      className={`border border-[var(--neutral-200)] rounded-lg overflow-hidden bg-white ${className}`}
      style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
    >
      <table className="w-full border-collapse">
        <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
          <tr className="bg-[var(--neutral-50)] border-b border-[var(--neutral-200)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${cellPadding} text-xs font-semibold uppercase tracking-wider text-[var(--neutral-500)] ${alignClass(col.align)} ${
                  col.sortable ? 'cursor-pointer select-none hover:text-[var(--neutral-700)] transition-colors' : ''
                }`}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.header}
                  {col.sortable && (
                    <SortIcon
                      direction={currentSort?.key === col.key ? currentSort.direction : null}
                    />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <LoadingRows columns={columns.length} />
          ) : displayData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12">
                {emptyState || (
                  <div className="text-center text-sm text-[var(--neutral-500)]">
                    Nenhum registro encontrado
                  </div>
                )}
              </td>
            </tr>
          ) : (
            displayData.map((row, rIdx) => (
              <tr
                key={rowKey(row)}
                className={`
                  border-b border-[var(--neutral-100)] last:border-b-0 transition-colors
                  ${striped && rIdx % 2 === 1 ? 'bg-[var(--neutral-50)]/50' : ''}
                  ${onRowClick ? 'cursor-pointer hover:bg-[var(--navy-50)]/50' : 'hover:bg-[var(--neutral-50)]'}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${cellPadding} text-sm text-[var(--neutral-700)] ${alignClass(col.align)}`}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Loading overlay for controlled loading */}
      {loading && data.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-3 border-t border-[var(--neutral-200)] bg-[var(--neutral-50)]">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--navy-600)]" />
          <span className="text-xs text-[var(--neutral-500)]">Carregando...</span>
        </div>
      )}
    </div>
  );
}