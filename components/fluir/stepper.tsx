'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { Check, LucideIcon } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  showDescription?: boolean;
  onStepClick?: (stepNumber: number) => void;
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, orientation = 'horizontal', showDescription = true, onStepClick, className, ...props }, ref) => {
    const isHorizontal = orientation === 'horizontal';

    return (
      <div ref={ref} className={clsx('w-full', className)} {...props}>

        {/* ── Mobile: compact dots + label below active dot ── */}
        <div className="sm:hidden">
          <div className="flex items-start">
            {steps.map((step, index) => {
              const stepNumber  = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent   = stepNumber === currentStep;
              return (
                <div key={step.id} className="flex items-start flex-1 min-w-0">
                  {/* Dot + label stacked */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => onStepClick?.(stepNumber)}
                      disabled={!onStepClick}
                      className={clsx(
                        'shrink-0 rounded-full border-2 flex items-center justify-center font-semibold transition-all',
                        (isCompleted || isCurrent) && onStepClick ? 'cursor-pointer' : 'cursor-default',
                        isCurrent
                          ? 'w-7 h-7 text-xs bg-white border-[var(--navy-700)] text-[var(--navy-700)]'
                          : isCompleted
                            ? 'w-5 h-5 mt-1 bg-[var(--navy-700)] border-[var(--navy-700)] text-white'
                            : 'w-5 h-5 mt-1 bg-white border-[var(--neutral-200)]'
                      )}
                    >
                      {isCompleted ? <Check className="w-3 h-3" /> : isCurrent ? stepNumber : null}
                    </button>
                    {isCurrent && (
                      <p className="mt-1.5 text-[10px] font-bold text-[var(--navy-700)] leading-tight whitespace-nowrap text-center">
                        {step.label}
                      </p>
                    )}
                  </div>
                  {/* Connector — vertically centered on the dots */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mt-3.5 mx-1 overflow-hidden bg-[var(--neutral-200)]">
                      <div className={clsx('h-full transition-all duration-500', isCompleted ? 'bg-[var(--navy-700)] w-full' : 'w-0')} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Desktop: full stepper with labels ── */}
        <div className={clsx(
          'w-full hidden sm:flex',
          isHorizontal ? 'items-start' : 'flex-col'
        )}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent   = stepNumber === currentStep;
            const isUpcoming  = stepNumber > currentStep;

            return (
              <div
                key={step.id}
                className={clsx(
                  'flex',
                  isHorizontal ? 'flex-1 items-center' : 'items-start',
                  !isHorizontal && index < steps.length - 1 && 'pb-8'
                )}
              >
                <div className={clsx('flex items-center', isHorizontal ? 'flex-row flex-1' : 'flex-row items-start gap-4')}>
                  <button
                    className={clsx(
                      'flex items-center gap-2.5 transition-opacity',
                      (isCompleted || isCurrent) && onStepClick ? 'cursor-pointer hover:opacity-70' : 'cursor-default'
                    )}
                    onClick={() => onStepClick?.(stepNumber)}
                    disabled={!onStepClick}
                  >
                    {/* Circle */}
                    <div className={clsx(
                      'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all font-semibold text-sm shrink-0',
                      isCompleted && 'bg-[var(--navy-700)] border-[var(--navy-700)] text-white',
                      isCurrent  && 'bg-white border-[var(--navy-700)] text-[var(--navy-700)]',
                      isUpcoming && 'bg-white border-[var(--neutral-300)] text-[var(--neutral-400)]'
                    )}>
                      {isCompleted ? <Check className="w-5 h-5" /> : step.icon ? <step.icon className="w-5 h-5" /> : stepNumber}
                    </div>

                    {/* Label */}
                    <div className="flex flex-col items-start">
                      <span className={clsx(
                        'font-semibold text-xs tracking-wider uppercase',
                        (isCompleted || isCurrent) ? 'text-[var(--neutral-900)]' : 'text-[var(--neutral-500)]'
                      )}>
                        {step.label}
                      </span>
                      {showDescription && step.description && (
                        <span className="text-xs text-[var(--neutral-600)] mt-0.5 max-w-xs">{step.description}</span>
                      )}
                    </div>
                  </button>

                  {/* Connector */}
                  {isHorizontal && index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-[var(--neutral-300)] mx-4 overflow-hidden">
                      <div
                        className="h-full bg-[var(--navy-700)] transition-all duration-500"
                        style={{ width: isCompleted ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>

                {!isHorizontal && index < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-[var(--neutral-300)] ml-5 -mt-8 overflow-hidden">
                    <div
                      className="w-full bg-[var(--navy-700)] transition-all duration-500"
                      style={{ height: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    );
  }
);

Stepper.displayName = 'Stepper';
