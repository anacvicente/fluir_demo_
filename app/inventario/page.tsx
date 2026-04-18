'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, ShieldAlert, ArrowRight, Settings2, ExternalLink, HelpCircle } from 'lucide-react';
import { AppSidebar } from '@/components/fluir/app-sidebar';
import { Button } from '@/components/fluir/button';
import { Badge } from '@/components/fluir/badge';
import { EmptyState } from '@/components/fluir/empty-state';
import { Tooltip } from '@/components/fluir/tooltip';
import { clsx } from 'clsx';
import { Select, type SelectOption } from '@/components/fluir/select';

// ─── Types ────────────────────────────────────────────────────────────────────

type InventoryStatus = 'concluido' | 'em_elaboracao' | 'pendente';
type FilterStatus    = 'all' | 'concluido' | 'em_elaboracao' | 'pendente';
type ProtoState      = 'vazio' | 'concluido' | 'elaboracao' | 'pendente' | 'misto';

interface Inventory {
  id: string;
  campaignId: string;
  campaignName: string;
  status: InventoryStatus;
  pgrStepsCompleted: number;
  riskSummary?: { emAtencao: number; critico: number; alto: number; moderado: number; baixo: number };
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PGR_STEPS = ['Controles', 'Responsável', 'Observações', 'CIPA'];

const MOCK_CONCLUIDO: Inventory[] = [
  {
    id: 'cp-1', campaignId: 'cp-1',
    campaignName: 'Mapeamento 2024.2',
    status: 'concluido',
    pgrStepsCompleted: 4,
    riskSummary: { emAtencao: 1, critico: 2, alto: 1, moderado: 3, baixo: 2 },
  },
];

const MOCK_ELABORACAO: Inventory[] = [
  {
    id: 'cp-2', campaignId: 'cp-2',
    campaignName: 'Diagnóstico Piloto — Logística',
    status: 'em_elaboracao',
    pgrStepsCompleted: 2,
  },
];

const MOCK_PENDENTE: Inventory[] = [
  {
    id: 'cp-3', campaignId: 'cp-3',
    campaignName: 'Diagnóstico RH 2023',
    status: 'pendente',
    pgrStepsCompleted: 0,
  },
];

const PROTO_STATES: Record<ProtoState, { label: string; inventories: Inventory[] }> = {
  vazio:      { label: 'Vazio',         inventories: [] },
  concluido:  { label: 'Só concluídos', inventories: MOCK_CONCLUIDO },
  elaboracao: { label: 'Em elaboração', inventories: MOCK_ELABORACAO },
  pendente:   { label: 'Pendentes',     inventories: MOCK_PENDENTE },
  misto:      { label: 'Tudo junto',    inventories: [...MOCK_CONCLUIDO, ...MOCK_ELABORACAO, ...MOCK_PENDENTE] },
};

// ─── Risk pill ────────────────────────────────────────────────────────────────

type RiskLevel = 'emAtencao' | 'critico' | 'alto' | 'moderado' | 'baixo';

function RiskPill({ level, count }: { level: RiskLevel; count: number }) {
  const styles: Record<RiskLevel, string> = {
    critico:   'bg-red-100 text-red-700',
    alto:      'bg-orange-100 text-orange-700',
    moderado:  'bg-amber-100 text-amber-700',
    baixo:     'bg-emerald-100 text-emerald-700',
    emAtencao: 'bg-white text-amber-700 border border-amber-300',
  };
  const labels: Record<RiskLevel, string> = {
    emAtencao: 'Em atenção', critico: 'Crítico', alto: 'Alto', moderado: 'Moderado', baixo: 'Baixo',
  };
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', styles[level])}>
      {count} {labels[level]}
    </span>
  );
}

// ─── Inventory card ───────────────────────────────────────────────────────────

function InventoryCard({ inv, onView, onCampaign }: {
  inv: Inventory;
  onView: () => void;
  onCampaign: () => void;
}) {
  const done       = inv.status === 'concluido';
  const inProgress = inv.status === 'em_elaboracao';
  const currentStep = inProgress ? inv.pgrStepsCompleted + 1 : 0;

  const badgeVariant: 'success' | 'warning' | 'neutral' =
    done ? 'success' : inProgress ? 'warning' : 'neutral';
  const badgeLabel =
    done ? 'Concluído' : inProgress ? 'Em elaboração' : 'Pendente';

  return (
    <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
      {done && <div className="h-1 w-full bg-[var(--emerald-600)]" />}
      <div className="p-5 space-y-4">

        {/* Name + badge */}
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold text-[var(--neutral-900)]">{inv.campaignName}</p>
          <Badge variant={badgeVariant} className="text-[10px] px-2 h-5 font-semibold shrink-0">
            {badgeLabel}
          </Badge>
        </div>

        {/* Risk summary (concluido) */}
        {done && inv.riskSummary && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {inv.riskSummary.critico   > 0 && <RiskPill level="critico"   count={inv.riskSummary.critico}   />}
              {inv.riskSummary.alto      > 0 && <RiskPill level="alto"      count={inv.riskSummary.alto}      />}
              {inv.riskSummary.moderado  > 0 && <RiskPill level="moderado"  count={inv.riskSummary.moderado}  />}
              {inv.riskSummary.baixo     > 0 && <RiskPill level="baixo"     count={inv.riskSummary.baixo}     />}
              {inv.riskSummary.emAtencao > 0 && <RiskPill level="emAtencao" count={inv.riskSummary.emAtencao} />}
            </div>
          </div>
        )}

        {/* Step track (em_elaboracao) — same pattern as draft campaign card */}
        {inProgress && (
          <div className="space-y-2">
            <div className="flex items-end gap-1.5">
              {PGR_STEPS.map((label, i) => {
                const stepNum = i + 1;
                const stepDone    = stepNum < currentStep;
                const stepCurrent = stepNum === currentStep;
                return (
                  <div key={label} className="flex flex-col items-start flex-1 min-w-0 gap-1">
                    <span className={clsx(
                      'text-[10px] font-semibold text-[var(--navy-900)] leading-none whitespace-nowrap',
                      stepCurrent ? 'opacity-100' : 'opacity-0 select-none pointer-events-none',
                    )}>
                      {label}
                    </span>
                    <div className="flex items-center w-full gap-1">
                      <div className={clsx(
                        'rounded-full shrink-0 transition-all',
                        stepCurrent ? 'w-2.5 h-2.5' : 'w-2 h-2',
                        stepDone    ? 'bg-[var(--emerald-500)]' :
                        stepCurrent ? 'bg-[var(--navy-900)]'    :
                                      'bg-[var(--neutral-200)]',
                      )} />
                      {i < PGR_STEPS.length - 1 && (
                        <div className={clsx('h-px flex-1', stepDone ? 'bg-[var(--emerald-200)]' : 'bg-[var(--neutral-200)]')} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pendente hint */}
        {inv.status === 'pendente' && (
          <p className="text-xs text-[var(--neutral-400)]">
            O inventário ainda não foi elaborado para esta campanha.
          </p>
        )}

        {/* Footer */}
        <div className="pt-1 border-t border-[var(--neutral-100)] flex items-center justify-between gap-3">
          {inProgress ? (
            <span className="text-xs text-[var(--neutral-500)]">
              {inv.pgrStepsCompleted > 0
                ? `${inv.pgrStepsCompleted} de ${PGR_STEPS.length} etapas`
                : 'Nenhuma etapa concluída'}
            </span>
          ) : (
            <button
              onClick={onCampaign}
              className="inline-flex items-center gap-1 text-xs text-[var(--neutral-500)] hover:text-[var(--navy-700)] transition-colors"
            >
              Ver campanha <ExternalLink className="w-3 h-3 shrink-0" />
            </button>
          )}
          <Button
            variant={done ? 'outline' : 'primary'}
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={onView}
          >
            {done ? 'Ver inventário' : inProgress ? 'Continuar' : 'Elaborar inventário'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

      </div>
    </div>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InventariosPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [protoState,   setProtoState]   = useState<ProtoState>('misto');

  const { inventories } = PROTO_STATES[protoState];

  const concluidos   = inventories.filter(i => i.status === 'concluido');
  const emElaboracao = inventories.filter(i => i.status === 'em_elaboracao');
  const pendentes    = inventories.filter(i => i.status === 'pendente');

  const filters: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all',           label: 'Todos',         count: inventories.length  },
    { key: 'concluido',     label: 'Concluídos',    count: concluidos.length   },
    { key: 'em_elaboracao', label: 'Em elaboração', count: emElaboracao.length },
    { key: 'pendente',      label: 'Pendentes',     count: pendentes.length    },
  ];

  const visible =
    activeFilter === 'concluido'     ? concluidos
    : activeFilter === 'em_elaboracao' ? emElaboracao
    : activeFilter === 'pendente'      ? pendentes
    : inventories;

  function navigateToInventory(inv: Inventory) {
    if (inv.status === 'pendente') {
      router.push(`/campanhas/${inv.campaignId}/inventario`);
    } else {
      router.push(`/inventario/${inv.id}`);
    }
  }

  return (
    <div className="flex overflow-hidden md:h-screen bg-[var(--surface-subtle)]">
      <AppSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 md:overflow-y-auto">

        {/* Top bar */}
        <header className="h-14 border-b border-[var(--border)] bg-white px-4 md:px-8 flex items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="p-2.5 -ml-2 md:hidden text-[var(--text-secondary)]"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-semibold text-[var(--text-primary)] text-sm">Inventário + Plano de Ação</h1>
            <Tooltip content="Em breve" position="bottom">
              <button className="w-5 h-5 rounded-full flex items-center justify-center text-[var(--neutral-400)] hover:text-[var(--neutral-600)] transition-colors">
                <HelpCircle className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </header>

        {/* Prototype bar */}
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

          <div className="mb-6">
            <p className="text-sm text-[var(--neutral-500)]">
              Cada campanha encerrada gera um inventário de riscos psicossociais e um plano de ação.
            </p>
            <p className="text-sm text-[var(--neutral-500)] mt-1">
              Elabore o documento a partir da campanha ou acesse diretamente por esta lista.
            </p>
          </div>

          {inventories.length === 0 ? (
            <EmptyState
              variant="first-time"
              icon={<ShieldAlert className="w-8 h-8 text-[var(--navy-600)]" />}
              title="Nenhum inventário ainda"
              description="Os inventários são gerados automaticamente ao encerrar uma campanha."
            />
          ) : visible.length === 0 ? (
            <EmptyState
              variant="no-results"
              compact
              title={
                activeFilter === 'concluido'     ? 'Nenhum inventário concluído.' :
                activeFilter === 'em_elaboracao' ? 'Nenhum inventário em elaboração.' :
                                                   'Nenhum inventário pendente.'
              }
            />
          ) : (
            <div className="space-y-4">
              {visible.map(inv => (
                <InventoryCard
                  key={inv.id}
                  inv={inv}
                  onView={() => navigateToInventory(inv)}
                  onCampaign={() => router.push(`/campanhas/${inv.campaignId}`)}
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
