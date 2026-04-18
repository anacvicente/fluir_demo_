'use client';

import { forwardRef, useState, useRef, useEffect, HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, Check, X, Search } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
  /** Optional group name for grouped options */
  group?: string;
}

interface MultiSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: MultiSelectOption[];
  /** Array of selected values */
  value?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  searchable?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  /** Max tags visible in trigger before "+N" collapse */
  maxTagsVisible?: number;
  /** Show "select all" / "clear all" controls */
  showBulkActions?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  ({
    options,
    value = [],
    onChange,
    placeholder = 'Selecione...',
    label,
    error,
    helperText,
    searchable = false,
    disabled = false,
    size = 'md',
    maxTagsVisible = 3,
    showBulkActions = false,
    className,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selectedOptions = options.filter(o => value.includes(o.value));

    const filteredOptions = searchable && search
      ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
      : options;

    // Group options if any have group property
    const hasGroups = filteredOptions.some(o => o.group);
    const groupedOptions = hasGroups
      ? filteredOptions.reduce<Record<string, MultiSelectOption[]>>((acc, opt) => {
          const g = opt.group || 'Outros';
          if (!acc[g]) acc[g] = [];
          acc[g].push(opt);
          return acc;
        }, {})
      : null;

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

    const toggleOption = (optionValue: string) => {
      const opt = options.find(o => o.value === optionValue);
      if (opt?.disabled) return;

      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onChange?.(newValue);
    };

    const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(value.filter(v => v !== optionValue));
    };

    const selectAll = () => {
      const allEnabled = options.filter(o => !o.disabled).map(o => o.value);
      onChange?.(allEnabled);
    };

    const clearAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.([]);
      setSearch('');
    };

    const sizes = {
      sm: 'min-h-[36px] px-3 text-sm',
      md: 'min-h-[44px] px-4 text-sm'
    };

    const visibleTags = selectedOptions.slice(0, maxTagsVisible);
    const remainingCount = selectedOptions.length - maxTagsVisible;

    // Render a single option row
    const renderOption = (option: MultiSelectOption) => {
      const isSelected = value.includes(option.value);
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => toggleOption(option.value)}
          disabled={option.disabled}
          className={clsx(
            'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors',
            option.disabled
              ? 'text-[var(--neutral-400)] cursor-not-allowed bg-[var(--neutral-50)]'
              : 'text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]'
          )}
          title={option.disabled && option.disabledReason ? option.disabledReason : undefined}
        >
          {/* Checkbox visual */}
          <span
            className={clsx(
              'w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors',
              isSelected
                ? 'bg-[var(--navy-700)] border-[var(--navy-700)]'
                : 'border-[var(--neutral-300)] bg-white',
              option.disabled && 'opacity-50'
            )}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </span>

          <span className="flex-1 truncate">{option.label}</span>

          {option.disabled && option.disabledReason && (
            <span className="text-[10px] text-[var(--neutral-400)] flex-shrink-0 max-w-[140px] truncate">
              {option.disabledReason}
            </span>
          )}
        </button>
      );
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
          <div
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                !disabled && setIsOpen(!isOpen);
              }
            }}
            className={clsx(
              'w-full flex items-center gap-2 rounded-lg border transition-all cursor-pointer',
              'bg-white',
              sizes[size],
              isOpen && 'ring-2 ring-[var(--navy-500)] border-transparent',
              error
                ? 'border-[var(--error)] focus:ring-[var(--error)]'
                : 'border-[var(--neutral-300)] hover:border-[var(--neutral-400)]',
              disabled && 'bg-[var(--neutral-100)] cursor-not-allowed opacity-60'
            )}
          >
            <div className="flex-1 flex flex-wrap gap-1.5 py-1">
              {selectedOptions.length === 0 ? (
                <span className="text-[var(--neutral-400)]">{placeholder}</span>
              ) : (
                <>
                  {visibleTags.map((opt) => (
                    <span
                      key={opt.value}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--navy-100)] text-[var(--navy-900)] text-xs font-medium border border-[var(--navy-200)]"
                    >
                      <span className="truncate max-w-[120px]">{opt.label}</span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => handleRemoveTag(opt.value, e)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') handleRemoveTag(opt.value, e as unknown as React.MouseEvent);
                        }}
                        className="flex-shrink-0 hover:bg-[var(--navy-200)] rounded-sm cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </span>
                    </span>
                  ))}
                  {remainingCount > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-[var(--neutral-100)] text-[var(--neutral-600)] text-xs font-medium border border-[var(--neutral-200)]">
                      +{remainingCount}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Clear all */}
            {selectedOptions.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                onClick={clearAll}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') clearAll(e as unknown as React.MouseEvent); }}
                className="text-[var(--neutral-400)] hover:text-[var(--neutral-600)] transition-colors flex-shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </span>
            )}

            <ChevronDown className={clsx(
              'w-4 h-4 text-[var(--neutral-400)] transition-transform flex-shrink-0',
              isOpen && 'rotate-180'
            )} />
          </div>

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

              {/* Bulk actions */}
              {showBulkActions && !search && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--neutral-100)]">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs text-[var(--navy-700)] hover:text-[var(--navy-900)] font-medium transition-colors"
                  >
                    Selecionar todos
                  </button>
                  <button
                    type="button"
                    onClick={(e) => clearAll(e)}
                    className="text-xs text-[var(--neutral-500)] hover:text-[var(--neutral-700)] font-medium transition-colors"
                  >
                    Limpar seleção
                  </button>
                </div>
              )}

              {/* Selected count */}
              {selectedOptions.length > 0 && (
                <div className="px-4 py-1.5 border-b border-[var(--neutral-100)] bg-[var(--neutral-50)]">
                  <span className="text-xs text-[var(--neutral-500)]">
                    {selectedOptions.length} selecionado{selectedOptions.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Options */}
              <div className="max-h-60 overflow-y-auto py-1">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[var(--neutral-500)] text-center">
                    Nenhuma opção encontrada
                  </div>
                ) : groupedOptions ? (
                  Object.entries(groupedOptions).map(([group, opts]) => (
                    <div key={group}>
                      <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-[var(--neutral-400)]">
                        {group}
                      </div>
                      {opts.map(renderOption)}
                    </div>
                  ))
                ) : (
                  filteredOptions.map(renderOption)
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

MultiSelect.displayName = 'MultiSelect';