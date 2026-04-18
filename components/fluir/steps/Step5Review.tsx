'use client';

import { useState } from 'react';
import { Users, Layers, Building2, UserCheck, CalendarDays, Pencil, Rocket, ChevronDown, Mail } from 'lucide-react';
import { Button } from '@/components/fluir/button';
import { Toggle } from '@/components/fluir/toggle';
import type { GroupWithCriterion } from './Step2Groups';
import type { CipaData } from './Step3Cipa';
import type { DurationData } from './Step4Duration';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step5ReviewProps {
  groups?: GroupWithCriterion[];
  cipa?: CipaData;
  duration?: DurationData;
  hasEmails?: boolean;
  onBack: () => void;
  onActivate: () => void;
  onEditStep: (step: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function uniqueCnpjs(groups: GroupWithCriterion[]): number {
  const all = groups.flatMap(g => g.cnpjList ?? []);
  return all.length > 0 ? new Set(all).size : groups.reduce((sum, g) => sum + g.cnpjs, 0);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ label, step, onEdit }: { label: string; step: number; onEdit: (s: number) => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--neutral-400)]">{label}</span>
      <button
        onClick={() => onEdit(step)}
        className="flex items-center gap-1 text-xs font-semibold text-[var(--navy-600)] hover:text-[var(--navy-800)] transition-colors"
      >
        <Pencil className="w-3 h-3" />
        Editar
      </button>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon: React.ElementType }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--neutral-200)] shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="min-w-0 flex-1 mr-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--neutral-400)] mb-0.5">{label}</p>
        <div className="text-xl font-extrabold text-[var(--neutral-900)] leading-tight truncate">{value}</div>
      </div>
      <Icon className="w-7 h-7 text-[var(--neutral-100)] shrink-0" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const BASE_STATS = { participants: 242, groups: 5, cnpjs: 3 };

export default function Step5Review({ groups, cipa, duration, hasEmails = true, onBack, onActivate, onEditStep }: Step5ReviewProps) {
  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const [sendEmails,   setSendEmails]   = useState(true);

  const totalWorkers = groups?.reduce((sum, g) => sum + g.workers, 0) ?? BASE_STATS.participants;
  const groupCount   = groups?.length ?? BASE_STATS.groups;
  const cnpjCount    = groups ? uniqueCnpjs(groups) : BASE_STATS.cnpjs;

  return (
    <div className="space-y-8">

      {/* Header */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-[var(--neutral-900)] mb-2">
          Revisão da campanha
        </h2>
        <p className="text-[var(--neutral-600)]">
          Confira as informações antes de ativar. Você pode ajustar a campanha depois que ela estiver ativa.
        </p>
      </section>

      <div className="space-y-6">

        {/* ── Row: two equal-height aggregator cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

          {/* Card left — Participantes + CIPA */}
          <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm flex flex-col h-full divide-y divide-[var(--neutral-100)]">
            {/* Base block */}
            <div className="px-5 pt-4 pb-5">
              <SectionLabel label="Base de participantes" step={1} onEdit={onEditStep} />
              <div className="flex gap-6">
                {[
                  { label: 'participantes', value: totalWorkers },
                  { label: 'grupos',        value: groupCount   },
                  { label: 'CNPJs',         value: cnpjCount    },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-2xl font-extrabold text-[var(--neutral-900)] leading-none">{value}</p>
                    <p className="text-xs text-[var(--neutral-400)] mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CIPA block */}
            <div className="px-5 pt-4 pb-5 flex-1">
              <SectionLabel label="CIPA" step={3} onEdit={onEditStep} />
              {cipa ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--navy-100)] flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4 text-[var(--navy-600)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--neutral-900)]">{cipa.name}</p>
                    <p className="text-xs text-[var(--neutral-400)]">{cipa.group}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--neutral-400)]">Não informado.</p>
              )}
            </div>
          </div>

          {/* Card right — Período as list rows */}
          <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm h-full flex flex-col">
            <div className="px-5 pt-4 flex-1 flex flex-col">
              <SectionLabel label="Período da campanha" step={4} onEdit={onEditStep} />
              <div className="flex-1 flex flex-col justify-around divide-y divide-[var(--neutral-100)]">
                {[
                  { label: 'Inicia em',    value: duration ? formatDateBR(duration.startDate) : '—', bold: false },
                  { label: 'Termina em',   value: duration ? formatDateBR(duration.endDate)   : '—', bold: false },
                  { label: 'Duração total',value: duration ? `${duration.durationDays} dias`  : '—', bold: true  },
                ].map(({ label, value, bold }) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <span className="text-sm text-[var(--neutral-500)]">{label}</span>
                    <span className={bold
                      ? 'text-base font-extrabold text-[var(--navy-900)]'
                      : 'text-sm font-semibold text-[var(--neutral-900)]'
                    }>{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-5" />{/* bottom padding inside card */}
          </div>

        </div>

        {/* ── Grupos — accordion ── */}
        <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <button
                onClick={() => setCriteriaOpen(o => !o)}
                className="flex items-center gap-2 group min-w-0"
              >
                <ChevronDown className={`w-4 h-4 text-[var(--neutral-400)] transition-transform duration-200 shrink-0 ${criteriaOpen ? 'rotate-180' : ''}`} />
                <div className="text-left min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--neutral-500)] group-hover:text-[var(--neutral-700)] transition-colors">
                    Grupos ({groupCount})
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--neutral-400)] group-hover:text-[var(--neutral-600)] transition-colors">
                    Critérios de semelhança
                  </span>
                </div>
              </button>
              <button
                onClick={() => onEditStep(2)}
                className="flex items-center gap-1 text-xs font-semibold text-[var(--navy-600)] hover:text-[var(--navy-800)] transition-colors shrink-0 ml-3"
              >
                <Pencil className="w-3 h-3" />
                Editar
              </button>
            </div>

            <div className={`overflow-hidden transition-all duration-200 ${criteriaOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-5 pb-5 space-y-2">
                {groups && groups.length > 0 ? (
                  groups.map(g => (
                    <div key={g.id} className="rounded-xl bg-[var(--neutral-50)] border border-[var(--neutral-100)] px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-[var(--neutral-900)]">{g.name}</span>
                        <span className="text-xs text-[var(--neutral-400)]">{g.workers} trabalhadores</span>
                      </div>
                      <p className="text-xs text-[var(--neutral-500)] line-clamp-2 leading-relaxed">{g.criterion}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[var(--neutral-400)]">Nenhum grupo configurado.</p>
                )}
              </div>
            </div>
        </div>

      </div>

      {/* ── E-mail opt-out ── */}
      {hasEmails && (
        <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-colors ${
          sendEmails
            ? 'border-[var(--navy-400)] bg-[var(--navy-50,#f0f4ff)]'
            : 'border-[var(--neutral-200)] bg-white'
        }`}>
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <Mail className="w-4 h-4 text-[var(--neutral-400)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[var(--neutral-900)]">
                Enviar convites por e-mail automaticamente
              </p>
              <ul className="mt-1.5 space-y-0.5 text-xs text-[var(--neutral-500)] leading-relaxed">
                <li className="flex items-start gap-1.5"><span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--neutral-400)] shrink-0" />Os trabalhadores com e-mail cadastrado na base receberão um convite para participar.</li>
                <li className="flex items-start gap-1.5"><span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--neutral-400)] shrink-0" />Desative se preferir distribuir o link de acesso manualmente.</li>
              </ul>
            </div>
          </div>
          <Toggle checked={sendEmails} onChange={setSendEmails} />
        </div>
      )}

      {/* ── Navigation ── */}
      {/* Mobile: full-width dark card + discreet Voltar below */}
      <div className="sm:hidden flex flex-col gap-2 pt-6 border-t border-[var(--neutral-200)]">
        <div className="flex flex-col gap-3 bg-[var(--navy-900)] rounded-2xl px-5 py-4">
          <div>
            <p className="text-sm font-bold text-white">Tudo certo?</p>
            <p className="text-xs text-[var(--navy-400)] mt-0.5">Convites enviados automaticamente após ativar.</p>
          </div>
          <button
            onClick={onActivate}
            className="inline-flex items-center justify-center gap-2 h-11 w-full rounded-xl bg-white text-[var(--navy-900)] text-sm font-bold hover:bg-[var(--navy-50)] transition-colors"
          >
            <Rocket className="w-4 h-4" />
            Ativar pesquisa
          </button>
        </div>
        <button
          onClick={onBack}
          className="w-full h-10 text-sm font-medium text-[var(--neutral-400)] hover:text-[var(--neutral-600)] transition-colors"
        >
          Voltar
        </button>
      </div>

      {/* Desktop: Voltar left, dark card right */}
      <div className="hidden sm:flex items-center justify-between pt-6 border-t border-[var(--neutral-200)] gap-3">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <div className="flex items-center gap-4 bg-[var(--navy-900)] rounded-2xl pl-5 pr-2 py-2">
          <div className="flex flex-col justify-center h-10">
            <p className="text-xs font-bold text-white leading-tight">Tudo certo?</p>
            <p className="text-[10px] text-[var(--navy-400)] leading-tight mt-0.5">Convites enviados após ativar.</p>
          </div>
          <button
            onClick={onActivate}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-white text-[var(--navy-900)] text-sm font-bold hover:bg-[var(--navy-50)] transition-colors whitespace-nowrap"
          >
            <Rocket className="w-4 h-4" />
            Ativar pesquisa
          </button>
        </div>
      </div>

    </div>
  );
}
