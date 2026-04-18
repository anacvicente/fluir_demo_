'use client';

import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  CircleDot,
  Loader2
} from 'lucide-react';

export type StatusBadgeVariant = 'compliant' | 'pending' | 'warning' | 'non-compliant' | 'in-progress' | 'processing';

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: StatusBadgeVariant;
  label?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ variant, label, icon, size = 'md', className, ...props }, ref) => {
    const variants = {
      compliant: {
        container: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle2 className={clsx(size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />,
        label: 'Conforme'
      },
      pending: {
        container: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <Clock className={clsx(size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />,
        label: 'Pendente'
      },
      warning: {
        container: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <AlertTriangle className={clsx(size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />,
        label: 'Atenção'
      },
      'non-compliant': {
        container: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className={clsx(size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />,
        label: 'Não Conforme'
      },
      'in-progress': {
        container: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <CircleDot className={clsx(size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />,
        label: 'Em Andamento'
      },
      processing: {
        container: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: <Loader2 className={clsx('animate-spin', size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />,
        label: 'Processando'
      }
    };

    const config = variants[variant];
    const sizes = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-xs gap-1.5',
      lg: 'px-3 py-1.5 text-sm gap-2'
    };

    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center rounded-md font-medium border whitespace-nowrap',
          config.container,
          sizes[size],
          className
        )}
        {...props}
      >
        {icon || config.icon}
        {label || config.label}
      </span>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';