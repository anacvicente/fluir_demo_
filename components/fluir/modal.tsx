'use client';

import { ReactNode, forwardRef, HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { X, AlertTriangle, AlertCircle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import { Button } from './button';

export type ModalVariant = 'default' | 'success' | 'error' | 'warning' | 'compliance';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: ModalVariant;
  children?: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    isOpen, 
    onClose, 
    title, 
    description, 
    variant = 'default',
    children, 
    footer,
    showCloseButton = true,
    size = 'md',
    className,
    ...props 
  }, ref) => {
    if (!isOpen) return null;

    const variants = {
      default: {
        icon: <Info className="w-6 h-6 text-[var(--navy-700)]" />,
        iconBg: 'bg-[var(--navy-100)]',
        border: 'border-[var(--navy-200)]'
      },
      success: {
        icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
        iconBg: 'bg-green-100',
        border: 'border-green-200'
      },
      error: {
        icon: <AlertCircle className="w-6 h-6 text-red-600" />,
        iconBg: 'bg-red-100',
        border: 'border-red-200'
      },
      warning: {
        icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
        iconBg: 'bg-amber-100',
        border: 'border-amber-200'
      },
      compliance: {
        icon: <ShieldAlert className="w-6 h-6 text-[var(--navy-700)]" />,
        iconBg: 'bg-[var(--navy-100)]',
        border: 'border-[var(--navy-300)]'
      }
    };

    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-lg sm:max-w-2xl',
      xl: 'max-w-xl sm:max-w-4xl'
    };

    const config = variants[variant];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          ref={ref}
          className={clsx(
            'bg-white rounded-xl shadow-2xl w-full flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200',
            sizes[size],
            className
          )}
          {...props}
        >
          {/* Header */}
          <div className={clsx('border-b-2 p-4 sm:p-6', config.border)}>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={clsx('flex-shrink-0 w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center', config.iconBg)}>
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-xl font-semibold text-[var(--neutral-900)] mb-1">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm text-[var(--neutral-600)]">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="flex-shrink-0 text-[var(--neutral-500)] hover:text-[var(--neutral-900)] transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {children && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-[var(--neutral-700)]">
              {children}
            </div>
          )}

          {/* Footer */}
          {footer && (
            <div className="border-t border-[var(--neutral-200)] p-4 sm:p-6 bg-[var(--neutral-50)] rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

// Modal de Confirmação pré-configurado
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant?: ModalVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'warning',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isDestructive = false,
  isLoading = false
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      variant={variant}
      size="sm"
      footer={
        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'destructive' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    />
  );
}