'use client';

import { forwardRef, useState, useRef, useEffect, useCallback, HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface PresetRange {
  label: string;
  getValue: () => DateRange;
}

interface DateRangePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  presets?: PresetRange[];
  minDate?: Date;
  maxDate?: Date;
  size?: 'sm' | 'md';
  clearable?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DAYS_PT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const d = date.getTime();
  return d >= start.getTime() && d <= end.getTime();
}

function formatDate(date: Date | null) {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

/** Generate `count` consecutive months starting from `from` */
function getMonthsList(from: Date, count: number): Array<{ year: number; month: number }> {
  const result: Array<{ year: number; month: number }> = [];
  let y = from.getFullYear();
  let m = from.getMonth();
  for (let i = 0; i < count; i++) {
    result.push({ year: y, month: m });
    m++;
    if (m > 11) { m = 0; y++; }
  }
  return result;
}

// ─── Preset factories ─────────────────────────────────────────────────────────

export function createCommonPresets(): PresetRange[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return [
    {
      label: 'Últimos 7 dias',
      getValue: () => {
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        return { start, end: today };
      },
    },
    {
      label: 'Últimos 30 dias',
      getValue: () => {
        const start = new Date(today);
        start.setDate(start.getDate() - 29);
        return { start, end: today };
      },
    },
    {
      label: 'Último trimestre',
      getValue: () => {
        const currentQ = Math.floor(today.getMonth() / 3);
        const prevQ = currentQ === 0 ? 3 : currentQ - 1;
        const year = currentQ === 0 ? today.getFullYear() - 1 : today.getFullYear();
        const start = new Date(year, prevQ * 3, 1);
        const end = new Date(year, prevQ * 3 + 3, 0);
        return { start, end };
      },
    },
    {
      label: 'Este mês',
      getValue: () => ({
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      }),
    },
    {
      label: 'Este ano',
      getValue: () => ({
        start: new Date(today.getFullYear(), 0, 1),
        end: today,
      }),
    },
  ];
}

// ─── Calendar Month Component ─────────────────────────────────────────────────

function CalendarMonth({
  year,
  month,
  value,
  hoverDate,
  selectionPhase,
  onDateClick,
  onDateHover,
  minDate,
  maxDate,
}: {
  year: number;
  month: number;
  value: DateRange;
  hoverDate: Date | null;
  selectionPhase: 'start' | 'end';
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const days: (Date | null)[] = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));

  const effectiveStart = value.start;
  const effectiveEnd = selectionPhase === 'end' && hoverDate ? hoverDate : value.end;

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS_PT.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-[var(--neutral-400)] py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className="aspect-square" />;

          const isDisabled =
            (minDate && date < minDate) ||
            (maxDate && date > maxDate);

          const isStart = effectiveStart && isSameDay(date, effectiveStart);
          const isEnd   = effectiveEnd && isSameDay(date, effectiveEnd);
          const inRange = isInRange(date, effectiveStart, effectiveEnd);
          const isToday = isSameDay(date, new Date());

          // Range highlight: left-cap on start, right-cap on end, full-width strip in between
          const isSingleDay = effectiveStart && effectiveEnd && isSameDay(effectiveStart, effectiveEnd);
          const showStrip   = inRange && !isStart && !isEnd && !isSingleDay;
          const showLeftCap  = (isStart && effectiveEnd && !isSingleDay);
          const showRightCap = (isEnd   && effectiveStart && !isSingleDay);

          return (
            <div
              key={date.toISOString()}
              className={clsx(
                'relative flex items-center justify-center',
                showStrip && 'bg-[var(--navy-50)]',
                showLeftCap && 'bg-gradient-to-r from-transparent to-[var(--navy-50)]',
                showRightCap && 'bg-gradient-to-l from-transparent to-[var(--navy-50)]',
              )}
            >
              <button
                type="button"
                disabled={!!isDisabled}
                onClick={() => onDateClick(date)}
                onMouseEnter={() => onDateHover(date)}
                onMouseLeave={() => onDateHover(null)}
                className={clsx(
                  'aspect-square w-full flex items-center justify-center text-xs transition-colors relative z-10 rounded-full',
                  isDisabled && 'text-[var(--neutral-300)] cursor-not-allowed',
                  !isDisabled && !isStart && !isEnd && 'hover:bg-[var(--neutral-100)] text-[var(--neutral-700)]',
                  inRange && !isStart && !isEnd && 'text-[var(--navy-900)]',
                  (isStart || isEnd) && 'bg-[var(--navy-900)] text-white font-semibold',
                  isToday && !isStart && !isEnd && 'font-semibold ring-1 ring-[var(--navy-300)]',
                )}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DateRangePicker ──────────────────────────────────────────────────────────

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  ({
    value = { start: null, end: null },
    onChange,
    label,
    error,
    helperText,
    placeholder = 'Selecionar período...',
    disabled = false,
    presets,
    minDate,
    maxDate,
    size = 'md',
    clearable = true,
    className,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [viewMonth, setViewMonth] = useState(() => {
      const d = value.start || new Date();
      return { year: d.getFullYear(), month: d.getMonth() };
    });
    const [selectionPhase, setSelectionPhase] = useState<'start' | 'end'>('start');
    const [hoverDate, setHoverDate]           = useState<Date | null>(null);
    const [tempRange, setTempRange]           = useState<DateRange>(value);
    const containerRef = useRef<HTMLDivElement>(null);

    // Detect mobile breakpoint
    useEffect(() => {
      const mq = window.matchMedia('(max-width: 767px)');
      setIsMobile(mq.matches);
      const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }, []);

    // Lock body scroll on mobile when open
    useEffect(() => {
      if (isMobile && isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => { document.body.style.overflow = ''; };
    }, [isMobile, isOpen]);

    // Sync temp with value when opening
    useEffect(() => {
      if (isOpen) {
        setTempRange(value);
        setSelectionPhase(value.start && !value.end ? 'end' : 'start');
        if (value.start) {
          setViewMonth({ year: value.start.getFullYear(), month: value.start.getMonth() });
        }
      }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Close on click outside (desktop only)
    useEffect(() => {
      if (isMobile) return;
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile]);

    const handleDateClick = useCallback((date: Date) => {
      if (selectionPhase === 'start') {
        setTempRange({ start: date, end: null });
        setSelectionPhase('end');
      } else {
        let start = tempRange.start!;
        let end = date;
        if (end < start) [start, end] = [end, start];
        const newRange = { start, end };
        setTempRange(newRange);
        if (!isMobile) {
          // Desktop: apply immediately and close
          onChange?.(newRange);
          setSelectionPhase('start');
          setIsOpen(false);
        } else {
          // Mobile: just update temp, wait for "Confirmar"
          setSelectionPhase('start');
        }
      }
    }, [selectionPhase, tempRange.start, onChange, isMobile]);

    const handleConfirm = () => {
      if (tempRange.start && tempRange.end) {
        onChange?.(tempRange);
      }
      setIsOpen(false);
    };

    const handleReset = () => {
      setTempRange({ start: null, end: null });
      setSelectionPhase('start');
    };

    const handlePresetClick = (preset: PresetRange) => {
      const range = preset.getValue();
      setTempRange(range);
      onChange?.(range);
      setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      const empty = { start: null, end: null };
      setTempRange(empty);
      onChange?.(empty);
    };

    const navigateMonth = (delta: number) => {
      setViewMonth(prev => {
        let newMonth = prev.month + delta;
        let newYear  = prev.year;
        if (newMonth > 11) { newMonth = 0; newYear++; }
        if (newMonth < 0)  { newMonth = 11; newYear--; }
        return { year: newYear, month: newMonth };
      });
    };

    const nextMonth = viewMonth.month === 11
      ? { year: viewMonth.year + 1, month: 0 }
      : { year: viewMonth.year, month: viewMonth.month + 1 };

    const displayValue = value.start
      ? value.end
        ? `${formatDate(value.start)} — ${formatDate(value.end)}`
        : formatDate(value.start)
      : '';

    const tempDays = tempRange.start && tempRange.end
      ? Math.round((tempRange.end.getTime() - tempRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0;
    const phaseLabel = tempRange.start && tempRange.end
      ? `${tempDays} ${tempDays === 1 ? 'dia' : 'dias'} de duração`
      : selectionPhase === 'start'
        ? 'Selecione a data de início'
        : 'Selecione a data de encerramento';

    const sizes = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-4 text-sm' };

    // 12 months from today for mobile scroll
    const mobileMonths = getMonthsList(minDate ?? new Date(), 12);

    return (
      <div ref={ref} className={clsx('w-full', className)} {...props}>
        {label && (
          <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
            {label}
          </label>
        )}

        <div ref={containerRef} className="relative">
          {/* ── Trigger ── */}
          <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !disabled && setIsOpen(!isOpen); }
            }}
            className={clsx(
              'w-full flex items-center gap-2 rounded-lg border transition-all cursor-pointer bg-white',
              sizes[size],
              isOpen && 'ring-2 ring-[var(--navy-500)] border-transparent',
              error
                ? 'border-[var(--error)]'
                : 'border-[var(--neutral-300)] hover:border-[var(--neutral-400)]',
              disabled && 'bg-[var(--neutral-100)] cursor-not-allowed opacity-60'
            )}
          >
            <Calendar className="w-4 h-4 text-[var(--neutral-400)] flex-shrink-0" />
            <span className={clsx('flex-1 truncate', displayValue ? 'text-[var(--neutral-900)]' : 'text-[var(--neutral-400)]')}>
              {displayValue || placeholder}
            </span>
            {clearable && displayValue && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClear(e as unknown as React.MouseEvent); }}
                className="text-[var(--neutral-400)] hover:text-[var(--neutral-600)] transition-colors flex-shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </span>
            )}
          </div>

          {/* ── Mobile overlay ── */}
          {isOpen && isMobile && (
            <div className="fixed inset-0 z-50 flex flex-col bg-white">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--neutral-100)]">
                <span className="text-base font-bold text-[var(--neutral-900)]">Quando?</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--neutral-100)] hover:bg-[var(--neutral-200)] transition-colors"
                >
                  <X className="w-4 h-4 text-[var(--neutral-600)]" />
                </button>
              </div>

              {/* Phase pill */}
              <div className="px-5 py-3">
                <span className="inline-block rounded-full bg-[var(--navy-50)] border border-[var(--navy-100)] px-3 py-1 text-xs font-semibold text-[var(--navy-700)]">
                  {phaseLabel}
                </span>
              </div>

              {/* Scrollable months */}
              <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-8">
                {mobileMonths.map(({ year, month }) => (
                  <div key={`${year}-${month}`}>
                    <p className="text-sm font-semibold text-[var(--neutral-800)] mb-3">
                      {MONTHS_PT[month]} de {year}
                    </p>
                    <CalendarMonth
                      year={year}
                      month={month}
                      value={tempRange}
                      hoverDate={hoverDate}
                      selectionPhase={selectionPhase}
                      onDateClick={handleDateClick}
                      onDateHover={setHoverDate}
                      minDate={minDate}
                      maxDate={maxDate}
                    />
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-[var(--neutral-100)] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-sm font-semibold text-[var(--neutral-700)] underline underline-offset-2"
                >
                  Redefinir
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!tempRange.start || !tempRange.end}
                  className={clsx(
                    'px-6 py-3 rounded-xl text-sm font-bold transition-all',
                    tempRange.start && tempRange.end
                      ? 'bg-[var(--navy-900)] text-white hover:bg-[var(--navy-700)]'
                      : 'bg-[var(--neutral-200)] text-[var(--neutral-400)] cursor-not-allowed'
                  )}
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}

          {/* ── Desktop dropdown ── */}
          {isOpen && !isMobile && (
            <div className="absolute z-50 mt-1 bg-white rounded-xl border border-[var(--neutral-200)] shadow-lg overflow-hidden">
              <div className="flex">
                {/* Presets sidebar */}
                {presets && presets.length > 0 && (
                  <div className="border-r border-[var(--neutral-100)] py-2 w-40 flex-shrink-0">
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-[var(--neutral-400)]">
                      Atalhos
                    </div>
                    {presets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handlePresetClick(preset)}
                        className="w-full text-left px-3 py-2 text-xs text-[var(--neutral-700)] hover:bg-[var(--neutral-50)] transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Calendars */}
                <div className="p-4">
                  <div className="text-xs text-[var(--neutral-500)] mb-3 text-center">{phaseLabel}</div>

                  <div className="flex gap-6">
                    {/* Month 1 */}
                    <div className="w-[240px]">
                      <div className="flex items-center justify-between mb-3">
                        <button
                          type="button"
                          onClick={() => navigateMonth(-1)}
                          className="p-1 rounded hover:bg-[var(--neutral-100)] transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-[var(--neutral-600)]" />
                        </button>
                        <span className="text-sm font-semibold text-[var(--neutral-900)]">
                          {MONTHS_PT[viewMonth.month]} {viewMonth.year}
                        </span>
                        <div className="w-6" />
                      </div>
                      <CalendarMonth
                        year={viewMonth.year}
                        month={viewMonth.month}
                        value={tempRange}
                        hoverDate={hoverDate}
                        selectionPhase={selectionPhase}
                        onDateClick={handleDateClick}
                        onDateHover={setHoverDate}
                        minDate={minDate}
                        maxDate={maxDate}
                      />
                    </div>

                    {/* Month 2 */}
                    <div className="w-[240px]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-6" />
                        <span className="text-sm font-semibold text-[var(--neutral-900)]">
                          {MONTHS_PT[nextMonth.month]} {nextMonth.year}
                        </span>
                        <button
                          type="button"
                          onClick={() => navigateMonth(1)}
                          className="p-1 rounded hover:bg-[var(--neutral-100)] transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-[var(--neutral-600)]" />
                        </button>
                      </div>
                      <CalendarMonth
                        year={nextMonth.year}
                        month={nextMonth.month}
                        value={tempRange}
                        hoverDate={hoverDate}
                        selectionPhase={selectionPhase}
                        onDateClick={handleDateClick}
                        onDateHover={setHoverDate}
                        minDate={minDate}
                        maxDate={maxDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-[var(--neutral-500)]">{helperText}</p>}
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';
