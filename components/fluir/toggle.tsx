'use client';

import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToggleProps {
  /** Whether the toggle is on */
  checked: boolean;
  /** Called when toggled */
  onChange: (checked: boolean) => void;
  /** Label text */
  label?: string;
  /** Helper text below the label */
  helperText?: string;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

export function Toggle({
  checked,
  onChange,
  label,
  helperText,
  size = 'md',
  disabled = false,
  className,
}: ToggleProps) {
  const sizeStyles = {
    sm: {
      track: 'w-8 h-[18px]',
      thumb: 'w-3.5 h-3.5',
      translate: checked ? 'translate-x-[14px]' : 'translate-x-[2px]',
      label: 'text-sm',
      helper: 'text-xs',
    },
    md: {
      track: 'w-10 h-[22px]',
      thumb: 'w-4 h-4',
      translate: checked ? 'translate-x-[19px]' : 'translate-x-[3px]',
      label: 'text-sm',
      helper: 'text-xs',
    },
  };

  const s = sizeStyles[size];

  return (
    <label
      className={clsx(
        'inline-flex items-start gap-3 select-none',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      )}
    >
      {/* Track */}
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          'relative inline-flex items-center rounded-full flex-shrink-0 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy-500)]/30',
          s.track,
          checked
            ? 'bg-[var(--navy-700)]'
            : 'bg-[var(--neutral-300)]'
        )}
      >
        <span
          className={clsx(
            'rounded-full bg-white shadow-sm transition-transform duration-200',
            s.thumb,
            s.translate
          )}
        />
      </button>

      {/* Label + helper */}
      {(label || helperText) && (
        <div className="pt-0.5">
          {label && (
            <span className={clsx('font-medium text-[var(--neutral-900)]', s.label)}>
              {label}
            </span>
          )}
          {helperText && (
            <p className={clsx('text-[var(--neutral-500)] mt-0.5', s.helper)}>
              {helperText}
            </p>
          )}
        </div>
      )}
    </label>
  );
}