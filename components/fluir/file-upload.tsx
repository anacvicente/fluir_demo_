'use client';

import { useState, useRef, useCallback, type ReactNode } from 'react';
import { Upload, File, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './button';

// ─── Types ────────────────────────────────────────────────────────────────────

export type FileUploadStatus = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

export interface ValidationError {
  line?: number;
  field?: string;
  message: string;
}

export interface FileUploadProps {
  /** Label above the upload area */
  label?: string;
  /** Accepted file types (e.g., '.csv,.xlsx') */
  accept?: string;
  /** Max file size in bytes */
  maxSize?: number;
  /** Helper text below */
  helperText?: string;
  /** Description inside the drop zone */
  description?: string;
  /** Called when file is selected */
  onFileSelect?: (file: File) => void;
  /** Called to remove the file */
  onRemove?: () => void;
  /** Controlled status */
  status?: FileUploadStatus;
  /** Currently selected file (controlled) */
  file?: File | null;
  /** Progress percentage (0-100) during upload */
  progress?: number;
  /** Validation errors to display */
  errors?: ValidationError[];
  /** Error message (simple string) */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Compact layout */
  compact?: boolean;
  /** Additional class */
  className?: string;
}

// ─── File Size Formatter ──────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ─── File Icon by Extension ──────────────────────────────────────────────────

function FileIcon({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase();
  let color = 'text-[var(--neutral-400)]';
  if (ext === 'csv') color = 'text-green-600';
  else if (ext === 'xlsx' || ext === 'xls') color = 'text-emerald-600';

  return <File className={`w-5 h-5 ${color}`} />;
}

// ─── FileUpload ──────────────────────────────────────────────────────────────

export function FileUpload({
  label,
  accept = '.csv,.xlsx,.xls',
  maxSize = 10 * 1024 * 1024, // 10MB default
  helperText,
  description,
  onFileSelect,
  onRemove,
  status: controlledStatus,
  file: controlledFile,
  progress,
  errors,
  error,
  disabled = false,
  compact = false,
  className = '',
}: FileUploadProps) {
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const [internalStatus, setInternalStatus] = useState<FileUploadStatus>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const file = controlledFile !== undefined ? controlledFile : internalFile;
  const status = controlledStatus || internalStatus;

  const handleFile = useCallback((f: File) => {
    setSizeError(null);
    if (maxSize && f.size > maxSize) {
      setSizeError(`Arquivo excede o limite de ${formatFileSize(maxSize)}`);
      return;
    }
    if (!controlledFile) setInternalFile(f);
    if (!controlledStatus) setInternalStatus('success');
    onFileSelect?.(f);
  }, [maxSize, onFileSelect, controlledFile, controlledStatus]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [disabled, handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    if (!controlledFile) setInternalFile(null);
    if (!controlledStatus) setInternalStatus('idle');
    setSizeError(null);
    onRemove?.();
  }, [onRemove, controlledFile, controlledStatus]);

  const displayError = error || sizeError;
  const hasErrors = errors && errors.length > 0;
  const showFile = file && status !== 'idle';

  // Border color based on state
  const borderColor = dragOver
    ? 'border-[var(--navy-500)] bg-[var(--navy-50)]'
    : displayError || hasErrors
    ? 'border-red-300 bg-red-50/30'
    : status === 'success' && !hasErrors
    ? 'border-green-300 bg-green-50/30'
    : 'border-[var(--neutral-300)] bg-white hover:border-[var(--neutral-400)]';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-[var(--neutral-700)] mb-1.5">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      {!showFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg transition-all
            ${borderColor}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${compact ? 'p-4' : 'p-8'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />

          <div className="flex flex-col items-center text-center gap-2">
            <div className={`rounded-full p-3 ${dragOver ? 'bg-[var(--navy-100)]' : 'bg-[var(--neutral-100)]'}`}>
              <Upload className={`w-6 h-6 ${dragOver ? 'text-[var(--navy-600)]' : 'text-[var(--neutral-400)]'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--neutral-700)]">
                {dragOver ? 'Solte o arquivo aqui' : 'Arraste e solte ou clique para selecionar'}
              </p>
              <p className="text-xs text-[var(--neutral-500)] mt-1">
                {description || `${accept.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')} • Máx. ${formatFileSize(maxSize)}`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* File Preview */
        <div className={`border rounded-lg ${hasErrors || displayError ? 'border-red-200 bg-red-50/30' : 'border-[var(--neutral-200)] bg-[var(--neutral-50)]'}`}>
          <div className="flex items-center gap-3 p-3">
            <FileIcon name={file.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--neutral-900)] truncate">{file.name}</p>
              <p className="text-xs text-[var(--neutral-500)]">{formatFileSize(file.size)}</p>
            </div>

            {/* Status icon */}
            {status === 'uploading' && (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--navy-600)]" />
            )}
            {status === 'success' && !hasErrors && !displayError && (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            )}
            {(status === 'error' || hasErrors || displayError) && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}

            {/* Remove button */}
            {status !== 'uploading' && (
              <button
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="p-1 rounded hover:bg-[var(--neutral-200)] transition-colors text-[var(--neutral-400)] hover:text-[var(--neutral-700)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress bar */}
          {status === 'uploading' && progress !== undefined && (
            <div className="px-3 pb-3">
              <div className="h-1.5 bg-[var(--neutral-200)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--navy-600)] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-[var(--neutral-500)] mt-1">{progress}% processado</p>
            </div>
          )}
        </div>
      )}

      {/* Simple error message */}
      {displayError && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {displayError}
        </p>
      )}

      {/* Validation errors list */}
      {hasErrors && (
        <div className="mt-2 border border-red-200 rounded-lg bg-red-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-red-200 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span className="text-xs font-semibold text-red-800">
              {errors.length} erro{errors.length > 1 ? 's' : ''} de validação
            </span>
          </div>
          <div className="max-h-40 overflow-y-auto divide-y divide-red-100">
            {errors.map((err, idx) => (
              <div key={idx} className="px-3 py-1.5 text-xs text-red-700">
                {err.line && (
                  <span className="font-mono font-semibold text-red-800 mr-1">Linha {err.line}:</span>
                )}
                {err.field && (
                  <span className="font-semibold mr-1">{err.field} —</span>
                )}
                {err.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helper text */}
      {helperText && !displayError && !hasErrors && (
        <p className="text-xs text-[var(--neutral-500)] mt-1.5">{helperText}</p>
      )}
    </div>
  );
}