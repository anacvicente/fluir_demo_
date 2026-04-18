'use client';

import { type ReactNode } from 'react';
import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AvatarProps {
  /** Display name (used for initials fallback) */
  name: string;
  /** Image URL */
  src?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Shape */
  shape?: 'circle' | 'rounded';
  /** Status indicator */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Additional className */
  className?: string;
}

export interface CompanyBadgeProps {
  /** Company name */
  name: string;
  /** Company logo URL */
  logo?: string;
  /** Optional subtitle (e.g. CNPJ, plano) */
  subtitle?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'default' | 'minimal' | 'card';
  /** Additional className */
  className?: string;
}

export interface AvatarGroupProps {
  /** List of avatars */
  avatars: { name: string; src?: string }[];
  /** Max to show before "+N" */
  max?: number;
  /** Size of each avatar */
  size?: 'xs' | 'sm' | 'md';
  /** Additional className */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

// Deterministic color from name
function getColor(name: string): string {
  const colors = [
    'bg-[var(--navy-700)]',
    'bg-[var(--emerald-600)]',
    'bg-amber-600',
    'bg-blue-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-teal-600',
    'bg-indigo-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// ─── Size Maps ───────────────────────────────────────────────────────────────

const sizeMap = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]', status: 'w-1.5 h-1.5 border' },
  sm: { container: 'w-8 h-8', text: 'text-xs', status: 'w-2 h-2 border-[1.5px]' },
  md: { container: 'w-10 h-10', text: 'text-sm', status: 'w-2.5 h-2.5 border-2' },
  lg: { container: 'w-14 h-14', text: 'text-lg', status: 'w-3 h-3 border-2' },
  xl: { container: 'w-20 h-20', text: 'text-2xl', status: 'w-3.5 h-3.5 border-2' },
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-[var(--neutral-400)]',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
};

// ─── Avatar ──────────────────────────────────────────────────────────────────

export function Avatar({
  name,
  src,
  size = 'md',
  shape = 'circle',
  status,
  className,
}: AvatarProps) {
  const s = sizeMap[size];
  const initials = getInitials(name);
  const bgColor = getColor(name);

  return (
    <div className={clsx('relative inline-flex flex-shrink-0', className)}>
      <div
        className={clsx(
          'flex items-center justify-center overflow-hidden',
          s.container,
          shape === 'circle' ? 'rounded-full' : 'rounded-lg',
          !src && bgColor
        )}
        title={name}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className={clsx('font-semibold text-white select-none', s.text)}>
            {initials}
          </span>
        )}
      </div>

      {/* Status dot */}
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-white',
            s.status,
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

// ─── Avatar Group ────────────────────────────────────────────────────────────

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'sm',
  className,
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const s = sizeMap[size];

  return (
    <div className={clsx('flex -space-x-2', className)}>
      {visible.map((a, i) => (
        <div key={i} className="ring-2 ring-white rounded-full">
          <Avatar name={a.name} src={a.src} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            'flex items-center justify-center rounded-full bg-[var(--neutral-200)] text-[var(--neutral-600)] font-semibold ring-2 ring-white',
            s.container,
            s.text
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

// ─── Company Badge ───────────────────────────────────────────────────────────

export function CompanyBadge({
  name,
  logo,
  subtitle,
  size = 'md',
  variant = 'default',
  className,
}: CompanyBadgeProps) {
  const sizes = {
    sm: { avatar: 'w-7 h-7', name: 'text-xs', subtitle: 'text-[10px]' },
    md: { avatar: 'w-9 h-9', name: 'text-sm', subtitle: 'text-xs' },
    lg: { avatar: 'w-11 h-11', name: 'text-base', subtitle: 'text-sm' },
  };
  const s = sizes[size];

  const variantStyles = {
    default: 'bg-white border border-[var(--neutral-200)] rounded-lg px-3 py-2',
    minimal: '',
    card: 'bg-[var(--neutral-50)] border border-[var(--neutral-200)] rounded-xl px-4 py-3 shadow-sm',
  };

  const initials = getInitials(name);
  const bgColor = getColor(name);

  return (
    <div className={clsx('flex items-center gap-2.5', variantStyles[variant], className)}>
      <div
        className={clsx(
          'flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0',
          s.avatar,
          !logo && bgColor
        )}
      >
        {logo ? (
          <img src={logo} alt={name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-white font-bold text-xs">{initials}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className={clsx('font-semibold text-[var(--neutral-900)] truncate', s.name)}>{name}</p>
        {subtitle && (
          <p className={clsx('text-[var(--neutral-500)] truncate', s.subtitle)}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}