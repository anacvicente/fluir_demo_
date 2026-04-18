'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Plus, ClipboardList, ArrowRight, Users, Calendar, BarChart2, Settings2 } from 'lucide-react';
import { AppSidebar } from '@/components/fluir/app-sidebar';
import { Button } from '@/components/fluir/button';
import { Badge } from '@/components/fluir/badge';
import { clsx } from 'clsx';
import { Select, type SelectOption } from '@/components/fluir/select';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Campaign {
  id: string;
  name: string;
  status: 'collecting' | 'paused' | 'closed';
  startDate: string;
  endDate: string;
  totalWorkers: number;
  responses: number;
}

interface CampaignDraft {
  id: string;
  name: string;
  currentStep: number;
  completedSteps: number[];
  savedAt: string;
}

type FilterStatus = 'all' | 'collecting' | 'closed' | 'draft';
type ProtoState   = 'empty' | 'rascunhos' | 'ativa' | 'concluidas' | 'misto';

// ─── Mock data ────────────────────────────────────────────────────────────────

const STEPS = ['Base', 'Grupos', 'CIPA', 'Duração', 'Revisão'];

const MOCK_ACTIVE: Campaign[] = [
  {
    id: 'ac-1',
    name: 'Mapeamento 2025.1',
    status: 'collecting',
    startDate: '2025-03-10',
    endDate: '2025-04-20',
    totalWorkers: 139,
    responses: 87,
  },
];

const MOCK_CLOSED: Campaign[] = [
  {
    id: 'cp-1',
    name: 'Mapeamento 2024.2',
    status: 'closed',
    startDate: '2024-09-01',
    endDate: '2024-09-30',
    totalWorkers: 139,
    responses: 121,
  },
  {
    id: 'cp-2',
    name: 'Diagnóstico Piloto — Logística',
    status: 'closed',
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    totalWorkers: 19,
    responses: 17,
  },
];

const MOCK_DRAFTS: CampaignDraft[] = [
  {
    id: 'dr-1',
    name: 'Mapeamento 2025.2',
    currentStep: 3,
    completedSteps: [1, 2],
    savedAt: '2025-04-08T14:30:00Z',
  },
  {
    id: 'dr-2',
    name: 'Diagnóstico RH',
    currentStep: 1,
    completedSteps: [],
    savedAt: '2025-04-09T09:15:00Z',
  },
];

const PROTO_STATES: Record<ProtoState, { label: string; campaigns: Campaign[]; drafts: CampaignDraft[] }> = {
  empty:      { label: 'Primeiro acesso',  campaigns: [],                               drafts: []          },
  rascunhos:  { label: 'Só rascunhos',     campaigns: [],                               drafts: MOCK_DRAFTS },
  ativa:      { label: 'Campanha ativa',   campaigns: MOCK_ACTIVE,                      drafts: []          },
  concluidas: { label: 'Só concluídas',    campaigns: MOCK_CLOSED,                      drafts: []          },
  misto:      { label: 'Tudo junto',       campaigns: [...MOCK_ACTIVE, ...MOCK_CLOSED], drafts: MOCK_DRAFTS },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' às '
    + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ─── Campaign card ────────────────────────────────────────────────────────────

function CampaignCard({ campaign, onOpen }: { campaign: Campaign; onOpen: () => void }) {
  const pct    = Math.round((campaign.responses / campaign.totalWorkers) * 100);
  const active = campaign.status === 'collecting';

  return (
    <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
      {active && <div className="h-1 w-full bg-[var(--emerald-600)]" />}
      <div className="p-5 space-y-4">

        {/* Name + badge */}
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold text-[var(--neutral-900)]">{campaign.name}</p>
          {active
            ? <Badge variant="success"  className="text-[10px] px-2 h-5 font-semibold shrink-0">Em andamento</Badge>
            : <Badge variant="neutral"  className="text-[10px] px-2 h-5 font-semibold shrink-0">Encerrada</Badge>
          }
        </div>

        {/* Response progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--neutral-500)] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Respostas recebidas
            </span>
            <span className="font-semibold text-[var(--neutral-800)]">
              {campaign.responses} de {campaign.totalWorkers}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[var(--neutral-100)] overflow-hidden">
            <div
              className={clsx('h-full rounded-full', active ? 'bg-[var(--emerald-600)]' : 'bg-[var(--neutral-300)]')}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-[var(--neutral-400)]">{pct}% de participação</p>
        </div>

        {/* Dates + CTA */}
        <div className="pt-1 border-t border-[var(--neutral-100)] flex items-center justify-between gap-3">
          <p className="text-xs text-[var(--neutral-400)] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            {formatDate(campaign.startDate)} → {formatDate(campaign.endDate)}
          </p>
          {active ? (
            <Button variant="primary" size="sm" className="gap-1.5 shrink-0" onClick={onOpen}>
              Acessar campanha <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={onOpen}>
              <BarChart2 className="w-3.5 h-3.5" />
              Ver resultados
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Draft card ───────────────────────────────────────────────────────────────

function DraftCard({ draft, onContinue }: { draft: CampaignDraft; onContinue: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-[var(--neutral-900)] truncate">{draft.name}</p>
        <Badge variant="warning" className="text-[10px] px-2 h-5 font-semibold shrink-0">Rascunho</Badge>
      </div>

      <div className="space-y-2">
        {/* Step track — label only above current step */}
        <div className="flex items-end gap-1.5">
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            const done    = draft.completedSteps.includes(stepNum);
            const current = stepNum === draft.currentStep && !done;
            return (
              <div key={label} className="flex flex-col items-start flex-1 min-w-0 gap-1">
                <span className={clsx(
                  'text-[10px] font-semibold text-[var(--navy-900)] leading-none whitespace-nowrap',
                  current ? 'opacity-100' : 'opacity-0 select-none pointer-events-none',
                )}>
                  {label}
                </span>
                <div className="flex items-center w-full gap-1">
                  <div className={clsx(
                    'rounded-full shrink-0 transition-all',
                    current ? 'w-2.5 h-2.5' : 'w-2 h-2',
                    done    ? 'bg-[var(--emerald-500)]' :
                    current ? 'bg-[var(--navy-900)]' :
                              'bg-[var(--neutral-200)]',
                  )} />
                  {i < STEPS.length - 1 && (
                    <div className={clsx('h-px flex-1', done ? 'bg-[var(--emerald-200)]' : 'bg-[var(--neutral-200)]')} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="pt-1 border-t border-[var(--neutral-100)] flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--neutral-500)]">
          {draft.completedSteps.length > 0
            ? `${draft.completedSteps.length} de ${STEPS.length} etapas`
            : 'Nenhuma etapa concluída'}
        </p>
        <Button variant="primary" size="sm" className="gap-1.5 shrink-0" onClick={onContinue}>
          Continuar <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyAll({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[var(--navy-900)] flex items-center justify-center mx-auto mb-4">
        <ClipboardList className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-base font-bold text-[var(--neutral-900)] mb-1">Nenhuma campanha ainda</h2>
      <p className="text-sm text-[var(--neutral-500)] max-w-xs leading-relaxed mb-6">
        Crie sua primeira campanha para iniciar o mapeamento de riscos psicossociais.
      </p>
      <Button variant="primary" size="lg" className="gap-2" onClick={onNew}>
        <Plus className="w-4 h-4" />
        Criar nova campanha
      </Button>
    </div>
  );
}

function EmptyFilter({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-10 h-10 rounded-xl bg-[var(--neutral-100)] flex items-center justify-center mx-auto mb-3">
        <ClipboardList className="w-5 h-5 text-[var(--neutral-400)]" />
      </div>
      <p className="text-sm text-[var(--neutral-500)]">{label}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CampanhasPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [protoState,   setProtoState]   = useState<ProtoState>('misto');

  const { campaigns, drafts } = PROTO_STATES[protoState];
  const total = campaigns.length + drafts.length;

  const collectingCampaigns = campaigns.filter(c => c.status === 'collecting');
  const closedCampaigns     = campaigns.filter(c => c.status === 'closed');

  const filters: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all',        label: 'Todas',        count: total                    },
    { key: 'collecting', label: 'Em andamento', count: collectingCampaigns.length },
    { key: 'closed',     label: 'Encerradas',   count: closedCampaigns.length   },
    { key: 'draft',      label: 'Rascunhos',    count: drafts.length            },
  ];

  const visibleCampaigns = activeFilter === 'collecting' ? collectingCampaigns
                         : activeFilter === 'closed'     ? closedCampaigns
                         : activeFilter === 'draft'      ? []
                         : campaigns;

  const visibleDrafts = activeFilter === 'draft' || activeFilter === 'all' ? drafts : [];

  const nothingVisible = visibleCampaigns.length === 0 && visibleDrafts.length === 0;

  return (
    <div className="flex overflow-hidden md:h-screen bg-[var(--surface-subtle)]">
      <AppSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 md:overflow-y-auto">

        {/* Top bar */}
        <header className="h-14 border-b border-[var(--border)] bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="p-2.5 -ml-2 md:hidden text-[var(--text-secondary)]"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-semibold text-[var(--text-primary)] text-sm">Campanhas</h1>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="gap-1.5"
            onClick={() => router.push('/campanhas/nova')}
          >
            <Plus className="w-3.5 h-3.5" />
            Nova campanha
          </Button>
        </header>

        {/* Prototype state switcher */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 md:px-8 py-2 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 shrink-0">
            <Settings2 className="w-3.5 h-3.5" />
            Protótipo
          </div>
          <div className="h-3.5 w-px bg-amber-200 shrink-0" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-amber-700 whitespace-nowrap">Estado:</label>
            <select
              value={protoState}
              onChange={e => { setProtoState(e.target.value as ProtoState); setActiveFilter('all'); }}
              className="text-xs text-amber-900 bg-white border border-amber-200 rounded-lg px-2.5 py-1 outline-none focus:border-amber-400 cursor-pointer font-medium"
            >
              {(Object.entries(PROTO_STATES) as [ProtoState, { label: string }][]).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-[var(--neutral-200)] px-4 md:px-8 py-3">
          {/* Mobile: DS Select */}
          <div className="sm:hidden">
            <Select
              size="sm"
              value={activeFilter}
              onChange={v => setActiveFilter(v as FilterStatus)}
              options={filters.map(f => ({
                value: f.key,
                label: f.count > 0 ? `${f.label} (${f.count})` : f.label,
              }) satisfies SelectOption)}
            />
          </div>
          {/* Desktop: chips centrados */}
          <div className="hidden sm:flex items-center justify-center gap-2">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={clsx(
                  'inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-semibold transition-colors',
                  activeFilter === f.key
                    ? 'bg-[var(--navy-900)] text-white'
                    : 'bg-[var(--neutral-100)] text-[var(--neutral-600)] hover:bg-[var(--neutral-200)]',
                )}
              >
                {f.label}
                {f.count > 0 && (
                  <span className={clsx(
                    'text-[10px] font-bold px-1 py-0.5 rounded-full leading-none',
                    activeFilter === f.key
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--neutral-200)] text-[var(--neutral-500)]',
                  )}>
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
          {total === 0 ? (
            <EmptyAll onNew={() => router.push('/campanhas/nova')} />
          ) : nothingVisible ? (
            <EmptyFilter label={
              activeFilter === 'collecting' ? 'Nenhuma campanha em andamento.' :
              activeFilter === 'closed'     ? 'Nenhuma campanha encerrada.' :
                                              'Nenhum rascunho salvo.'
            } />
          ) : (
            <div className="space-y-4">
              {visibleCampaigns.map(c => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  onOpen={() => router.push(`/campanhas/${c.id}`)}
                />
              ))}
              {visibleDrafts.map(draft => (
                <DraftCard
                  key={draft.id}
                  draft={draft}
                  onContinue={() => router.push('/campanhas/nova')}
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
