'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchInputProps {
  /** Current value (controlled) */
  value?: string;
  /** Called with debounced value */
  onSearch?: (query: string) => void;
  /** Called on every keystroke (no debounce) */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in ms */
  debounce?: number;
  /** Loading state (e.g., while fetching results) */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Additional className */
  className?: string;
}

// ─── Search Input ────────────────────────────────────────────────────────────

export function SearchInput({
  value: controlledValue,
  onSearch,
  onChange,
  placeholder = 'Buscar...',
  debounce = 300,
  loading = false,
  disabled = false,
  size = 'md',
  className,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync controlled value
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChange = useCallback((val: string) => {
    setInternalValue(val);
    onChange?.(val);

    if (onSearch) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearch(val);
      }, debounce);
    }
  }, [onSearch, onChange, debounce]);

  const handleClear = useCallback(() => {
    handleChange('');
    inputRef.current?.focus();
  }, [handleChange]);

  // Cleanup timer
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const sizeStyles = {
    sm: 'h-8 text-xs pl-8 pr-8',
    md: 'h-10 text-sm pl-10 pr-10',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  const iconPositions = {
    sm: 'left-2.5',
    md: 'left-3',
  };

  const clearPositions = {
    sm: 'right-2',
    md: 'right-3',
  };

  return (
    <div className={clsx('relative', className)}>
      {/* Search icon */}
      <div className={clsx('absolute top-1/2 -translate-y-1/2 text-[var(--neutral-400)] pointer-events-none', iconPositions[size])}>
        {loading ? (
          <Loader2 className={clsx(iconSizes[size], 'animate-spin')} />
        ) : (
          <Search className={iconSizes[size]} />
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          'w-full rounded-lg border border-[var(--neutral-300)] bg-white transition-colors',
          'focus:outline-none focus:border-[var(--navy-500)] focus:ring-2 focus:ring-[var(--navy-500)]/20',
          'placeholder:text-[var(--neutral-400)]',
          disabled && 'opacity-50 cursor-not-allowed bg-[var(--neutral-50)]',
          sizeStyles[size]
        )}
      />

      {/* Clear button */}
      {internalValue && !disabled && (
        <button
          onClick={handleClear}
          className={clsx(
            'absolute top-1/2 -translate-y-1/2 p-0.5 rounded text-[var(--neutral-400)] hover:text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] transition-colors',
            clearPositions[size]
          )}
        >
          <X className={iconSizes[size]} />
        </button>
      )}
    </div>
  );
}