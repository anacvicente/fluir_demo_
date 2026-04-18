'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import {
  ArrowRight, ArrowLeft, Users, Building2,
  CheckCircle2, Eye, Circle, Pencil, Plus, FileText,
} from 'lucide-react';
import { Button } from '../button';
import { Drawer } from '../drawer';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Group {
  id: string;
  name: string;
  workers: number;
  cnpjs: number;
  cnpjList?: string[];
}

export interface GroupWithCriterion extends Group {
  criterion: string;
}

interface Step2Props {
  onNext: (groups: GroupWithCriterion[]) => void;
  onBack: () => void;
  initialGroups?: Group[];
  initialCriteria?: Record<string, string>;
}

type CardState = 'empty' | 'editing' | 'confirmed';
type Tab = 'grupos' | 'exemplo' | 'pgr';

// ─── Mock data (replaced by parsed CSV in production) ─────────────────────────

const MOCK_GROUPS: Group[] = [
  { id: 'g-adm', name: 'Administrativo',        workers: 32, cnpjs: 1, cnpjList: ['12.345.678/0001-90'] },
  { id: 'g-ops', name: 'Operações',              workers: 45, cnpjs: 2, cnpjList: ['12.345.678/0001-90', '12.345.678/0002-71'] },
  { id: 'g-cs',  name: 'Atendimento ao Cliente', workers: 28, cnpjs: 1, cnpjList: ['12.345.678/0001-90'] },
  { id: 'g-log', name: 'Logística',              workers: 19, cnpjs: 2, cnpjList: ['12.345.678/0002-71', '12.345.678/0003-52'] },
  { id: 'g-ti',  name: 'Tecnologia',             workers: 15, cnpjs: 1, cnpjList: ['12.345.678/0001-90'] },
];

// ─── Example data ────────────────────────────────────────────────────────────

const EXAMPLE_GROUPS: (Group & { criterion: string })[] = [
  {
    id: 'ex-aten',
    name: 'Atendimento e Suporte',
    workers: 31,
    cnpjs: 1,
    cnpjList: ['12.345.678/0001-90'],
    criterion: 'Atendimento contínuo ao público com fila de demandas, tempo de resposta monitorado e exposição frequente a situações de conflito — equipe sujeita às mesmas exigências de cordialidade e autocontrole durante toda a jornada.',
  },
  {
    id: 'ex-adm',
    name: 'Administrativo',
    workers: 24,
    cnpjs: 1,
    cnpjList: ['12.345.678/0001-90'],
    criterion: 'Trabalho sentado em escritório com uso intensivo de computador, pressão concentrada nos períodos de fechamento e alta dependência de informações e aprovações de outras áreas para concluir as próprias tarefas.',
  },
  {
    id: 'ex-log',
    name: 'Logística e Armazém',
    workers: 19,
    cnpjs: 2,
    cnpjList: ['12.345.678/0002-71', '12.345.678/0003-52'],
    criterion: 'Mesmo setor e condições ergonômicas, com trabalho predominantemente em pé, movimentação manual de cargas e uso de equipamentos de transporte.',
  },
];

function ExamplePreview() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-[var(--navy-50)] border border-[var(--navy-200)] rounded-xl">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--navy-400)] mt-2 shrink-0" />
        <p className="text-sm text-[var(--navy-800)]">
          Veja como ficam os cards quando os critérios estão preenchidos. Use estes exemplos
          como referência para descrever os seus próprios grupos.
        </p>
      </div>

      <div className="space-y-4">
        {EXAMPLE_GROUPS.map(group => (
          <div
            key={group.id}
            className="bg-white rounded-xl border border-[var(--emerald-200)] shadow-sm overflow-hidden"
          >
            <div className="h-1 w-full bg-[var(--emerald-400)]" />
            <div className="p-5 space-y-4">
              {/* Name + stats */}
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[var(--emerald-500)] shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[var(--neutral-900)] text-base leading-snug mb-1.5">
                    {group.name}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--neutral-500)]">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        <span className="font-semibold text-[var(--neutral-800)]">{group.workers}</span>{' '}
                        trabalhadores
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--neutral-500)]">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        <span className="font-semibold text-[var(--neutral-800)]">{group.cnpjs}</span>{' '}
                        CNPJs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Confirmed criterion */}
              <div className="px-4 py-3 bg-[var(--emerald-50)] border border-[var(--emerald-200)] rounded-xl">
                <p className="text-[10px] font-bold text-[var(--emerald-700)] uppercase tracking-wide mb-1.5">
                  Critério de semelhança
                </p>
                <p className="text-sm text-[var(--neutral-800)] leading-relaxed">
                  {group.criterion}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Anexo III preview ────────────────────────────────────────────────────────

const ANNEX_ITEMS = [
  { id: 'periodo',     text: 'período de abertura e encerramento da coleta' },
  { id: 'canal',       text: 'canal de aplicação utilizado' },
  { id: 'elegib',      text: 'critérios de elegibilidade dos participantes' },
  { id: 'respondentes',text: 'número de respondentes' },
  { id: 'taxa',        text: 'taxa de resposta' },
  { id: 'setores',     text: 'setores ou grupos efetivamente consolidados' },
  { id: 'versao-inst', text: 'versão do instrumento e parâmetros adotados' },
  { id: 'versao-met',  text: 'versão da metodologia ou versão do sistema, se existir' },
  { id: 'regras',      text: 'regras de consolidação por setor ou grupo exposto' },
  { id: 'criterio',    text: 'critério de semelhança para formação dos grupos', highlight: true },
  { id: 'exclusao',    text: 'registros de exclusão metodológica, quando aplicáveis' },
  { id: 'data',        text: 'data de emissão do relatório' },
];

function Annex3Preview() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--neutral-600)]">
        Veja onde o critério de semelhança aparece no documento oficial do PGR, conforme exigido pela NR-01.
      </p>

      {/* NR-01 badge */}
      <div className="flex items-start gap-3 p-4 bg-[var(--navy-50)] border border-[var(--navy-200)] rounded-xl">
        <div className="w-7 h-7 rounded-full bg-[var(--navy-100)] flex items-center justify-center shrink-0 mt-0.5">
          <FileText className="w-3.5 h-3.5 text-[var(--navy-700)]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--navy-900)] mb-0.5">Exigência NR-01</p>
          <p className="text-sm text-[var(--navy-800)]">
            O Registro metodológico é parte obrigatória do PGR. Cada campo preenchido aqui
            será inserido automaticamente no documento gerado pela plataforma.
          </p>
        </div>
      </div>

      {/* Document preview */}
      <div className="rounded-2xl border border-[var(--neutral-200)] overflow-hidden shadow-sm">
        {/* Document header */}
        <div className="px-6 py-4 bg-[var(--neutral-50)] border-b border-[var(--neutral-200)]">
          <p className="text-[11px] font-bold text-[var(--neutral-400)] uppercase tracking-widest mb-1">
            Programa de Gerenciamento de Riscos — PGR
          </p>
          <p className="font-bold text-[var(--neutral-900)] text-base">
            Anexo III — Registro metodológico
          </p>
        </div>

        {/* List */}
        <ul className="divide-y divide-[var(--neutral-100)]">
          {ANNEX_ITEMS.map(item => (
            <li
              key={item.id}
              className={clsx(
                'flex items-start gap-3 px-6 py-3 text-sm transition-colors',
                item.highlight
                  ? 'bg-[var(--navy-50)]'
                  : 'bg-white text-[var(--neutral-600)]',
              )}
            >
              <span className={clsx(
                'mt-[7px] w-1.5 h-1.5 rounded-full shrink-0',
                item.highlight ? 'bg-[var(--navy-500)]' : 'bg-[var(--neutral-300)]',
              )} />
              <span className={clsx(
                item.highlight
                  ? 'font-semibold text-[var(--navy-900)]'
                  : 'text-[var(--neutral-600)]',
              )}>
                {item.text}
                {item.highlight && (
                  <span className="ml-2 inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-[var(--navy-100)] text-[var(--navy-700)] px-1.5 py-0.5 rounded">
                    preenchido neste passo
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Annotation card */}
      <div className="rounded-xl border border-[var(--navy-200)] bg-white overflow-hidden">
        <div className="px-5 py-3 bg-[var(--navy-900)] flex items-center gap-2">
          <span className="text-sm font-bold text-white">Critério de semelhança para formação dos grupos</span>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-[var(--neutral-700)]">
            A NR-01 exige que cada Grupo Homogêneo de Exposição (GHE) tenha um critério de semelhança
            documentado, que justifique por que esses trabalhadores foram agrupados juntos.
          </p>
          <p className="text-sm text-[var(--neutral-700)]">
            Esse texto é preenchido por você neste passo, grupo a grupo, e será registrado
            automaticamente no Anexo III do PGR gerado pela plataforma.
          </p>
          <div className="pt-1 border-t border-[var(--neutral-100)]">
            <p className="text-xs text-[var(--neutral-400)]">
              Exemplos válidos: <span className="italic">"Trabalho em pé com movimentação de cargas e mesmas condições ergonômicas"</span>,{' '}
              <span className="italic">"Atendimento contínuo ao público com tempo de resposta monitorado"</span>,{' '}
              <span className="italic">"Trabalho em escritório com pressão concentrada nos períodos de fechamento"</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Step2Groups({ onNext, onBack, initialGroups, initialCriteria }: Step2Props) {
  const groups = initialGroups ?? MOCK_GROUPS;

  const [activeTab, setActiveTab] = useState<Tab>('grupos');
  const tabSectionRef = useRef<HTMLDivElement>(null);

  const [confirmed, setConfirmed] = useState<Record<string, string>>(
    () => initialCriteria ?? {}
  );
  const [cardState, setCardState] = useState<Record<string, CardState>>(
    () => Object.fromEntries(
      groups.map(g => [g.id, initialCriteria?.[g.id] ? 'confirmed' : 'empty'])
    )
  );
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [viewingId, setViewingId] = useState<string | null>(null);

  const viewingGroup = viewingId ? groups.find(g => g.id === viewingId) ?? null : null;
  const allConfirmed = groups.every(g => cardState[g.id] === 'confirmed');

  // ── Actions ──────────────────────────────────────────────────────────────────

  const startEditing = (id: string) => {
    setDrafts(prev => ({ ...prev, [id]: confirmed[id] ?? '' }));
    setCardState(prev => ({ ...prev, [id]: 'editing' }));
  };

  const cancelEditing = (id: string) => {
    setCardState(prev => ({ ...prev, [id]: confirmed[id] ? 'confirmed' : 'empty' }));
    setDrafts(prev => ({ ...prev, [id]: '' }));
  };

  const saveCriterion = (id: string) => {
    const text = drafts[id]?.trim();
    if (!text) return;
    setConfirmed(prev => ({ ...prev, [id]: text }));
    setCardState(prev => ({ ...prev, [id]: 'confirmed' }));
    setDrafts(prev => ({ ...prev, [id]: '' }));
    // TODO: PATCH /api/campaigns/:id/groups/:groupId/criterion
  };

  const handleNext = () => {
    onNext(groups.map(g => ({ ...g, criterion: confirmed[g.id] ?? '' })));
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div ref={tabSectionRef} className="space-y-6 pb-8">

      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-[var(--neutral-900)] mb-1">
          Grupos identificados
        </h2>
        <p className="text-sm text-[var(--neutral-500)]">
          {groups.length} grupo{groups.length !== 1 ? 's' : ''} encontrado{groups.length !== 1 ? 's' : ''} na base enviada.
          Para cada um, defina o critério de semelhança utilizado para formá-lo.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--neutral-200)]">
        {([
          { key: 'grupos',  short: 'Grupos',  long: 'Grupos' },
          { key: 'exemplo', short: 'Exemplo', long: 'Exemplo de semelhança' },
          { key: 'pgr',     short: 'No PGR',  long: 'Como fica no PGR' },
        ] as { key: Tab; short: string; long: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={clsx(
              'px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0',
              activeTab === t.key
                ? 'border-[var(--navy-900)] text-[var(--navy-900)]'
                : 'border-transparent text-[var(--neutral-500)] hover:text-[var(--neutral-700)]',
            )}
          >
            <span className="sm:hidden">{t.short}</span>
            <span className="hidden sm:inline">{t.long}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'pgr' ? (
        <Annex3Preview />
      ) : activeTab === 'exemplo' ? (
        <ExamplePreview />
      ) : (
        <>
          {/* Group cards */}
          <div className="space-y-4">
            {groups.map((group) => {
              const state   = cardState[group.id] ?? 'empty';
              const done    = state === 'confirmed';
              const editing = state === 'editing';

              return (
                <div
                  key={group.id}
                  className={clsx(
                    'bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-200',
                    done    && 'border-[var(--emerald-200)]',
                    editing && 'border-[var(--navy-300)] ring-2 ring-[var(--navy-100)]',
                    !done && !editing && 'border-[var(--neutral-200)]',
                  )}
                >
                  {/* Colored top bar */}
                  <div className={clsx(
                    'h-1 w-full transition-all duration-300',
                    done    && 'bg-[var(--emerald-400)]',
                    editing && 'bg-[var(--navy-400)]',
                    !done && !editing && 'bg-[var(--neutral-200)]',
                  )} />

                  <div className="p-5 space-y-4">
                    {/* Name + stats */}
                    <div className="flex items-start gap-2.5">
                      <div className="shrink-0 mt-0.5">
                        {done
                          ? <CheckCircle2 className="w-5 h-5 text-[var(--emerald-500)]" />
                          : <Circle       className="w-5 h-5 text-[var(--neutral-300)]" />
                        }
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[var(--neutral-900)] text-base leading-snug mb-1.5">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1.5 text-xs text-[var(--neutral-500)]">
                            <Users className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              <span className="font-semibold text-[var(--neutral-800)]">{group.workers}</span>{' '}
                              trabalhador{group.workers !== 1 ? 'es' : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[var(--neutral-500)]">
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              <span className="font-semibold text-[var(--neutral-800)]">{group.cnpjs}</span>{' '}
                              CNPJ{group.cnpjs !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <button
                            onClick={() => setViewingId(group.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-[var(--navy-600)] hover:text-[var(--navy-800)] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Detalhes
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Empty */}
                    {state === 'empty' && (
                      <button
                        onClick={() => startEditing(group.id)}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-[var(--neutral-200)] text-sm font-semibold text-[var(--neutral-500)] hover:border-[var(--navy-300)] hover:text-[var(--navy-700)] hover:bg-[var(--navy-50)] transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        Definir critério de semelhança
                      </button>
                    )}

                    {/* Editing */}
                    {state === 'editing' && (
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[var(--neutral-600)] uppercase tracking-wide">
                            Critério de semelhança
                          </label>
                          <textarea
                            autoFocus
                            rows={3}
                            value={drafts[group.id] ?? ''}
                            onChange={e => setDrafts(prev => ({ ...prev, [group.id]: e.target.value }))}
                            placeholder="Descreva o que torna esses trabalhadores um grupo homogêneo de exposição, ex: mesmo ambiente, mesmos riscos, mesma jornada…"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--navy-300)] text-sm text-[var(--neutral-900)] placeholder:text-[var(--neutral-400)] outline-none focus:border-[var(--navy-500)] focus:ring-2 focus:ring-[var(--navy-100)] transition-all resize-none"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => cancelEditing(group.id)}>
                            Cancelar
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => saveCriterion(group.id)}
                            disabled={!drafts[group.id]?.trim()}
                            className="gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Salvar critério
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Confirmed */}
                    {state === 'confirmed' && (
                      <div className="flex items-start justify-between gap-3 px-4 py-3 bg-[var(--emerald-50)] border border-[var(--emerald-200)] rounded-xl">
                        <p className="text-sm text-[var(--neutral-800)] leading-relaxed flex-1">
                          {confirmed[group.id]}
                        </p>
                        <button
                          onClick={() => startEditing(group.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-[var(--neutral-500)] hover:text-[var(--navy-700)] transition-colors shrink-0 mt-0.5"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-[var(--neutral-200)]">
            <Button variant="outline" size="lg" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            <div className="flex flex-col items-end gap-1">
              {allConfirmed && (
                <span className="flex items-center gap-1 text-xs text-[var(--emerald-600)] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Todos os critérios confirmados
                </span>
              )}
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={!allConfirmed}
                className="gap-2 group"
              >
                Continuar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              {!allConfirmed && (
                <span className="text-xs text-[var(--neutral-400)]">
                  Confirme o critério de todos os grupos
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {/* Detail Drawer */}
      <Drawer
        open={!!viewingId}
        onClose={() => setViewingId(null)}
        title={viewingGroup?.name ?? ''}
        subtitle="Detalhes do grupo"
        width="md"
        footer={
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setViewingId(null)}>
              Fechar
            </Button>
          </div>
        }
      >
        {viewingGroup && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 bg-[var(--neutral-50)] rounded-xl border border-[var(--neutral-200)]">
              <div className="w-9 h-9 rounded-full bg-[var(--navy-100)] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-[var(--navy-700)]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[var(--neutral-500)] uppercase tracking-wider mb-0.5">Trabalhadores</p>
                <p className="text-2xl font-bold text-[var(--neutral-900)] leading-none">{viewingGroup.workers}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-[var(--neutral-500)] uppercase tracking-wider mb-2">
                CNPJs mapeados
              </p>
              <div className="space-y-2">
                {(viewingGroup.cnpjList ?? []).map(cnpj => (
                  <div key={cnpj} className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-[var(--neutral-200)]">
                    <Building2 className="w-4 h-4 text-[var(--neutral-400)] shrink-0" />
                    <span className="text-sm font-medium text-[var(--neutral-800)] font-mono">{cnpj}</span>
                  </div>
                ))}
              </div>
            </div>

            {confirmed[viewingGroup.id] && (
              <div>
                <p className="text-[11px] font-bold text-[var(--neutral-500)] uppercase tracking-wider mb-2">
                  Critério de semelhança
                </p>
                <div className="px-4 py-3 bg-[var(--emerald-50)] border border-[var(--emerald-200)] rounded-xl">
                  <p className="text-sm text-[var(--neutral-800)] leading-relaxed">
                    {confirmed[viewingGroup.id]}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
