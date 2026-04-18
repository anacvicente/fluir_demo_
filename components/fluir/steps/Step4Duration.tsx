'use client';

import { useState } from 'react';
import { ArrowRight, CalendarDays, Clock, Lightbulb } from 'lucide-react';
import { Button } from '@/components/fluir/button';
import { DateRangePicker, type DateRange } from '@/components/fluir/date-range-picker';
import clsx from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DurationData {
  startDate: string;
  endDate: string;
  durationDays: number;
}

interface Step4DurationProps {
  onNext: (data: DurationData) => void;
  onBack: () => void;
  initialData?: DurationData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromISODate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function diffDays(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Step4Duration({ onNext, onBack, initialData }: Step4DurationProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [range, setRange] = useState<DateRange>({
    start: initialData?.startDate ? fromISODate(initialData.startDate) : null,
    end:   initialData?.endDate   ? fromISODate(initialData.endDate)   : null,
  });

  const days = range.start && range.end ? diffDays(range.start, range.end) : 0;
  const isValidRange  = days >= 1;
  const isBelowMin    = isValidRange && days < 15;
  const isRecommended = days >= 15;

  const handleNext = () => {
    if (!range.start || !range.end) return;
    onNext({ startDate: toISODate(range.start), endDate: toISODate(range.end), durationDays: days });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-[var(--neutral-900)] mb-2">
          Duração da campanha
        </h2>
        <p className="text-[var(--neutral-600)]">
          Defina o período em que a campanha ficará aberta para respostas.
        </p>
      </section>

      {/* Two-column, equal height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

        {/* ── Left card ── */}
        <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm p-6 flex flex-col gap-5 h-full">

          <DateRangePicker
            label="Período da campanha"
            value={range}
            onChange={setRange}
            minDate={today}
            placeholder="Selecione início e fim..."
            clearable
          />

          {/* Duration stat — appears after selection */}
          {isValidRange && (
            <div className={clsx(
              'rounded-xl border px-5 py-4 flex items-center justify-between transition-all',
              isRecommended ? 'border-[var(--navy-200)] bg-[var(--navy-50)]' : 'border-amber-200 bg-amber-50'
            )}>
              <div>
                <p className={clsx(
                  'text-[10px] font-bold uppercase tracking-widest mb-1',
                  isRecommended ? 'text-[var(--navy-400)]' : 'text-amber-500'
                )}>
                  {isBelowMin ? 'Abaixo do recomendado' : 'Duração'}
                </p>
                <p className={clsx(
                  'text-3xl font-extrabold leading-none',
                  isRecommended ? 'text-[var(--navy-900)]' : 'text-amber-800'
                )}>
                  {days}
                  <span className={clsx(
                    'text-base font-semibold ml-1.5',
                    isRecommended ? 'text-[var(--navy-600)]' : 'text-amber-600'
                  )}>
                    {days === 1 ? 'dia' : 'dias'}
                  </span>
                </p>
              </div>
              <Clock className={clsx(
                'w-10 h-10 shrink-0',
                isRecommended ? 'text-[var(--navy-100)]' : 'text-amber-200'
              )} />
            </div>
          )}

          {/* Contextual feedback below the stat card */}
          {isBelowMin && (
            <div className="space-y-1.5">
              <p className="text-xs text-amber-700">
                Períodos muito curtos reduzem a adesão — colaboradores que não acessam diariamente podem perder a janela.
              </p>
              <p className="text-xs text-amber-700">
                A Fluir recomenda <strong>no mínimo 15 dias</strong> para garantir uma participação representativa.
              </p>
            </div>
          )}
          {isRecommended && (
            <p className="text-xs text-[var(--navy-600)]">
              Bom prazo. Campanhas nessa faixa têm maior taxa de resposta e permitem o envio de lembretes ao longo do período.
            </p>
          )}

          {/* Tip — appears after selection */}
          {isValidRange && (
            <div className="rounded-xl bg-[var(--navy-50)] border border-[var(--navy-100)] p-4 flex gap-3">
              <Lightbulb className="w-4 h-4 text-[var(--navy-400)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--navy-700)]">
                Alinhe o início da campanha com a comunicação interna para garantir que todos os colaboradores saibam que a pesquisa está disponível.
              </p>
            </div>
          )}
        </div>

        {/* ── Right card: guidance ── */}
        <div className="rounded-xl overflow-hidden shadow-md flex flex-col h-full" style={{ border: '1.5px solid #1e1b4b' }}>
          <div className="px-4 py-4 bg-[var(--navy-900)] flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-white shrink-0" />
            <span className="text-xs font-bold text-white uppercase tracking-widest leading-none">
              Orientações de prazo
            </span>
          </div>
          <div className="px-4 py-5 bg-white flex-1 flex flex-col gap-5">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--neutral-800)] leading-snug">
                A Fluir recomenda campanhas de{' '}
                <span className="text-[var(--navy-700)]">no mínimo 15 dias</span>.
              </p>
              <p className="text-sm text-[var(--neutral-600)]">
                Esse período garante que todos os trabalhadores tenham tempo suficiente para responder, mesmo os que acessam com menos frequência.
              </p>
            </div>

            <ul className="space-y-3">
              {[
                {
                  label: 'Flexibilidade total',
                  desc: 'Após a campanha estar ativa, você pode aumentar ou diminuir o prazo a qualquer momento.',
                },
                {
                  label: 'Campanha sempre ajustável',
                  desc: 'Fique tranquilo: nada é definitivo agora. Você tem controle total sobre o período.',
                },
                {
                  label: 'Engajamento progressivo',
                  desc: 'Campanhas mais longas permitem o envio de lembretes e aumentam a taxa de adesão.',
                },
              ].map(({ label, desc }) => (
                <li key={label} className="flex items-start gap-2">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[var(--neutral-400)] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--neutral-800)]">{label}</p>
                    <p className="text-xs text-[var(--neutral-500)] mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>{/* end grid */}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-[var(--neutral-200)]">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button
          variant="primary"
          size="lg"
          className="gap-2 group"
          onClick={handleNext}
          disabled={!isValidRange}
        >
          Continuar
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

    </div>
  );
}
