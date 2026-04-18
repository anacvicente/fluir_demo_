'use client';

import { forwardRef, useState, useRef, useEffect, HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, Check, X, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({
    options,
    value,
    onChange,
    placeholder = 'Selecione...',
    label,
    error,
    helperText,
    searchable = false,
    clearable = false,
    disabled = false,
    size = 'md',
    className,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selected = options.find(o => o.value === value);

    const filteredOptions = searchable && search
      ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
      : options;

    // Close on click outside
    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setSearch('');
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search on open
    useEffect(() => {
      if (isOpen && searchable && searchRef.current) {
        searchRef.current.focus();
      }
    }, [isOpen, searchable]);

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;
      onChange?.(option.value);
      setIsOpen(false);
      setSearch('');
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.('');
      setSearch('');
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 text-sm'
    };

    return (
      <div ref={ref} className={clsx('w-full', className)} {...props}>
        {label && (
          <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
            {label}
          </label>
        )}

        <div ref={containerRef} className="relative">
          {/* Trigger */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={clsx(
              'w-full flex items-center gap-2 rounded-lg border transition-all',
              'bg-white text-left',
              sizes[size],
              isOpen && 'ring-2 ring-[var(--navy-500)] border-transparent',
              error
                ? 'border-[var(--error)] focus:ring-[var(--error)]'
                : 'border-[var(--neutral-300)] hover:border-[var(--neutral-400)]',
              disabled && 'bg-[var(--neutral-100)] cursor-not-allowed opacity-60'
            )}
          >
            <span className={clsx(
              'flex-1 truncate',
              selected ? 'text-[var(--neutral-900)]' : 'text-[var(--neutral-400)]'
            )}>
              {selected ? selected.label : placeholder}
            </span>

            {clearable && selected && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClear(e as unknown as React.MouseEvent); }}
                className="text-[var(--neutral-400)] hover:text-[var(--neutral-600)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </span>
            )}

            <ChevronDown className={clsx(
              'w-4 h-4 text-[var(--neutral-400)] transition-transform flex-shrink-0',
              isOpen && 'rotate-180'
            )} />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-[var(--neutral-200)] shadow-lg overflow-hidden">
              {/* Search */}
              {searchable && (
                <div className="p-2 border-b border-[var(--neutral-100)]">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-[var(--neutral-200)] focus:outline-none focus:ring-1 focus:ring-[var(--navy-500)]"
                    />
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="max-h-60 overflow-y-auto py-1">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[var(--neutral-500)] text-center">
                    Nenhuma opção encontrada
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      disabled={option.disabled}
                      className={clsx(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors',
                        option.disabled
                          ? 'text-[var(--neutral-400)] cursor-not-allowed bg-[var(--neutral-50)]'
                          : option.value === value
                            ? 'bg-[var(--navy-50)] text-[var(--navy-900)]'
                            : 'text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]'
                      )}
                      title={option.disabled && option.disabledReason ? option.disabledReason : undefined}
                    >
                      <span className="flex-1 truncate">{option.label}</span>
                      {option.value === value && (
                        <Check className="w-4 h-4 text-[var(--navy-900)] flex-shrink-0" />
                      )}
                      {option.disabled && option.disabledReason && (
                        <span className="text-[10px] text-[var(--neutral-400)] flex-shrink-0 max-w-[140px] truncate">
                          {option.disabledReason}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[var(--neutral-500)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';