'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/fluir/button';
import { Skeleton } from '@/components/fluir/skeleton';
import clsx from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CipaData {
  cpf: string;
  name: string;
  email: string;
  birthdate: string;
  group: string;
  cnpj: string;
}

interface Step3CipaProps {
  onNext: (data: CipaData) => void;
  onBack: () => void;
  initialData?: CipaData;
}

// ─── Mock base ────────────────────────────────────────────────────────────────
// In production: lookup against the uploaded CSV parsed in Step 1.

const MOCK_BASE: CipaData[] = [
  { cpf: '123.456.789-09', name: 'Ana Souza',     email: 'ana.souza@empresa.com.br',     birthdate: '15/04/1990', group: 'Operações',      cnpj: '12.345.678/0001-90' },
  { cpf: '529.982.247-25', name: 'Carlos Mendes', email: 'carlos.mendes@empresa.com.br', birthdate: '22/08/1985', group: 'Logística',      cnpj: '12.345.678/0002-71' },
  { cpf: '111.444.777-35', name: 'Fernanda Lima', email: 'fernanda.lima@empresa.com.br', birthdate: '03/11/1992', group: 'Administrativo', cnpj: '12.345.678/0001-90' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCpf = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

type SearchState = 'idle' | 'searching' | 'not_found' | 'found' | 'confirmed';

export default function Step3Cipa({ onNext, onBack, initialData }: Step3CipaProps) {
  const [cpf,   setCpf]   = useState(initialData?.cpf ?? '');
  const [state, setState] = useState<SearchState>(initialData ? 'confirmed' : 'idle');
  const [rep,   setRep]   = useState<CipaData | null>(initialData ?? null);
  const mounted = useRef(false);

  useEffect(() => {
    // Skip on mount to avoid overriding restored draft state
    if (!mounted.current) { mounted.current = true; return; }
    if (!cpf.trim()) { setState('idle'); setRep(null); return; }

    // Show searching state immediately, then resolve after debounce
    setState('searching');
    setRep(null);
    const t = setTimeout(() => {
      // TODO: replace with real CPF validation + API lookup
      // Prototype: "1" → found, "2" → not found
      if (cpf.trim() === '2') { setState('not_found'); }
      else { setState('found'); setRep(MOCK_BASE[0]); }
    }, 800);
    return () => clearTimeout(t);
  }, [cpf]);

  const confirm = () => setState('confirmed');
  const reset   = () => { setCpf(''); setState('idle'); setRep(null); };

  return (
    <div className="space-y-6">

      {/* Header */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-[var(--neutral-900)] mb-2">
          Representante da CIPA
        </h2>
        <p className="text-[var(--neutral-600)]">
          Indique o CPF do representante da CIPA.
        </p>
      </section>

      {/* Two-column on desktop: CPF input left, info panel right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

      {/* CPF input card */}
      <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm p-6 space-y-5 h-full">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wide">
            CPF do representante
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={cpf}
              onChange={e => { if (state !== 'confirmed') setCpf(formatCpf(e.target.value)); }}
              placeholder="000.000.000-00"
              disabled={state === 'confirmed'}
              className={clsx(
                'w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all placeholder:text-[var(--neutral-400)] disabled:cursor-not-allowed',
                state === 'found' || state === 'confirmed'
                  ? 'border-[var(--emerald-400)] bg-white text-[var(--neutral-900)]'
                  : state === 'not_found'
                    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50 text-red-700'
                    : state === 'searching'
                      ? 'border-[var(--navy-300)] bg-white text-[var(--neutral-900)]'
                      : 'border-[var(--neutral-200)] focus:border-[var(--navy-500)] focus:ring-2 focus:ring-[var(--navy-100)] bg-white text-[var(--neutral-900)] disabled:bg-[var(--neutral-50)]'
              )}
            />
            {state === 'searching' && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--navy-400)] pointer-events-none animate-spin" />
            )}
            {(state === 'found' || state === 'confirmed') && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--emerald-500)] pointer-events-none" />
            )}
            {state === 'not_found' && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Error block */}
        {state === 'not_found' && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-2">
            <p className="text-sm font-semibold text-red-700">CPF não encontrado</p>
            <p className="text-sm text-red-600">
              Este CPF não consta na base de trabalhadores enviada. Verifique:
            </p>
            <ul className="space-y-1">
              {[
                'Se o número foi digitado corretamente.',
                'Se o trabalhador está incluído na planilha importada no passo anterior.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-red-600">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skeleton while searching */}
        {state === 'searching' && (
          <div className="rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] p-4 space-y-4">
            <div className="pb-3 border-b border-[var(--neutral-200)]">
              <Skeleton variant="text" width="45%" height={18} />
            </div>
            <div className="divide-y divide-[var(--neutral-100)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <Skeleton variant="text" width={112} />
                  <Skeleton variant="text" width="40%" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Worker confirmation card */}
        {rep && (state === 'found' || state === 'confirmed') && (
          <div className={clsx(
            'rounded-xl border p-4 space-y-4',
            state === 'confirmed'
              ? 'border-[var(--emerald-300)] bg-[var(--emerald-50)]'
              : 'border-[var(--neutral-200)] bg-[var(--neutral-50)]'
          )}>
            {/* Name + badge */}
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-[var(--neutral-200)]">
              <p className="font-semibold text-[var(--neutral-800)] text-base leading-tight">{rep.name}</p>
              {state === 'confirmed' && (
                <span className="text-[10px] font-bold text-[var(--emerald-700)] bg-[var(--emerald-100)] border border-[var(--emerald-200)] px-2 py-1 rounded-full uppercase tracking-wide shrink-0">
                  Confirmado
                </span>
              )}
            </div>

            {/* All fields as label → value rows */}
            <div className="divide-y divide-[var(--neutral-100)]">
              {([
                { label: 'CPF',                value: cpf         },
                { label: 'Data de nascimento', value: rep.birthdate },
                { label: 'E-mail',             value: rep.email   },
                { label: 'Grupo',              value: rep.group   },
                { label: 'CNPJ',               value: rep.cnpj    },
              ] as { label: string; value: string }[]).map(({ label, value }) => (
                <div key={label} className="flex items-baseline gap-3 py-1.5">
                  <span className="text-xs text-[var(--neutral-500)] w-36 shrink-0">{label}</span>
                  <span className="text-sm font-medium text-[var(--neutral-800)] break-all">{value}</span>
                </div>
              ))}
            </div>

            {state === 'found' && (
              <div className="flex items-center pt-1">
                <button
                  onClick={reset}
                  className="flex-1 text-xs text-[var(--neutral-400)] hover:text-[var(--neutral-600)] transition-colors underline-offset-2 hover:underline text-center -translate-x-[10px]"
                >
                  Nova busca
                </button>
                <Button variant="primary" size="sm" onClick={confirm} className="gap-1.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirmar representante
                </Button>
              </div>
            )}
            {state === 'confirmed' && (
              <button
                onClick={reset}
                className="text-xs text-[var(--neutral-400)] hover:text-[var(--neutral-600)] transition-colors underline-offset-2 hover:underline"
              >
                Alterar representante
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info panel — matches annotation card pattern from steps 1 & 2 */}
      <div className="rounded-xl overflow-hidden shadow-md h-full flex flex-col" style={{ border: '1.5px solid #1e1b4b' }}>
        <div className="px-4 py-4 bg-[var(--navy-900)] flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-widest leading-none">
            Questionário complementar
          </span>
          <span className="bg-[var(--emerald-500)] text-[var(--navy-900)] text-[10px] px-1.5 py-0.5 rounded font-bold leading-none shrink-0">
            NR-01
          </span>
        </div>
        <div className="px-4 py-5 bg-white flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--neutral-800)] leading-snug">
              A NR-01 prevê o preenchimento de um questionário complementar pelo representante da CIPA.
            </p>
            <p className="text-sm text-[var(--neutral-700)]">
              O trabalhador indicado nesta etapa responderá os seguintes questionários ao acessar a plataforma:
            </p>
            <ul className="space-y-2">
              {[
                { label: 'Questionário de Mapeamento',        desc: 'Igual ao dos demais trabalhadores da campanha.' },
                { label: 'Questionário complementar da CIPA', desc: 'Exclusivo do representante da CIPA.' },
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
          <div className="rounded-xl bg-[var(--navy-50)] border border-[var(--navy-100)] p-4 space-y-3">
            <p className="text-xs font-bold text-[var(--navy-800)] uppercase tracking-wide">Se não for preenchido:</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Registro de pendência no PGR',   desc: 'O questionário complementar ficará marcado como não preenchido.' },
                { label: 'Relatório considerado incompleto', desc: 'O processo não poderá ser concluído sem este formulário.' },
              ].map(({ label, desc }) => (
                <li key={label} className="flex items-start gap-2">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[var(--navy-400)] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--navy-800)]">{label}</p>
                    <p className="text-xs text-[var(--navy-600)] mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      </div>{/* end two-column grid */}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-[var(--neutral-200)]">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button
          variant="primary"
          size="lg"
          className="gap-2 group"
          onClick={() => rep && onNext({ ...rep, cpf })}
          disabled={state !== 'confirmed'}
        >
          Continuar
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
