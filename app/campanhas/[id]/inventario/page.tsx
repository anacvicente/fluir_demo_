'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, Menu, Settings2, CheckCircle2, AlertTriangle,
  Bell, ArrowRight, ArrowLeft, User, Building2, Check, Bookmark,
} from 'lucide-react';
import { clsx } from 'clsx';
import { AppSidebar } from '@/components/fluir/app-sidebar';
import { Button } from '@/components/fluir/button';
import { Stepper } from '@/components/fluir/stepper';
import { Modal } from '@/components/fluir/modal';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_CAMPAIGN_NAME = 'Mapeamento 2025.1';

const MOCK_CIPA_REP = {
  name:   'Carlos Mendes',
  email:  'carlos.mendes@empresa.com',
  group:  'Operações',
  sentAt: '10/03/2025',
};

const MOCK_CNPJS = [
  { cnpj: '12.345.678/0001-99', name: 'ACME Logística'  },
  { cnpj: '12.345.678/0002-80', name: 'ACME Indústria'  },
];

const STEPS = [
  { id: 'controles',   label: 'Controles'   },
  { id: 'responsavel', label: 'Responsável' },
  { id: 'observacoes', label: 'Observações' },
  { id: 'cipa',        label: 'CIPA'        },
];

const BLOCK1_ITEMS = [
  'Canal de denúncia',
  'Código de conduta',
  'Procedimento de apuração',
  'Treinamento de líderes',
  'Regras de jornada',
  'Comunicação formal',
];

const BLOCK2_ITEMS = [
  { label: 'Critérios e papéis',               hint: '' },
  { label: 'Planejamento de carga',             hint: '' },
  { label: 'Equilíbrio trabalho-vida',          hint: '' },
  { label: 'Canais de feedback',                hint: '' },
  { label: 'Organização do trabalho',           hint: '' },
  { label: 'Desenvolvimento e reconhecimento',  hint: '' },
  { label: 'Outro', hint: '' },
];

// ─── ControlsForm ─────────────────────────────────────────────────────────────

interface ControlsFormProps {
  block1: Record<string, boolean | null>;
  block2: string[];
  onBlock1Change: (key: string, value: boolean) => void;
  onBlock2Toggle: (key: string) => void;
  outroText: string;
  onOutroChange: (value: string) => void;
  label?: string;
}

function ControlsForm({ block1, block2, onBlock1Change, onBlock2Toggle, outroText, onOutroChange, label }: ControlsFormProps) {
  return (
    <div className="space-y-4">
      {label && (
        <p className="text-[10px] font-bold text-[var(--neutral-400)] uppercase tracking-wider">
          {label}
        </p>
      )}

      {/* Bloco 1 */}
      <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm p-6 space-y-4">
        <div className="divide-y divide-[var(--neutral-100)]">
          {BLOCK1_ITEMS.map(item => (
            <div key={item} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <span className="text-sm text-[var(--neutral-800)]">{item}</span>
              <div className="flex rounded-lg border border-[var(--neutral-200)] overflow-hidden shrink-0">
                <button
                  onClick={() => onBlock1Change(item, true)}
                  className={clsx(
                    'px-4 py-1.5 text-sm font-medium transition-all',
                    block1[item] === true
                      ? 'bg-[var(--navy-700)] text-white'
                      : 'bg-white text-[var(--neutral-600)] hover:bg-[var(--neutral-50)]'
                  )}
                >
                  Sim
                </button>
                <div className="w-px bg-[var(--neutral-200)]" />
                <button
                  onClick={() => onBlock1Change(item, false)}
                  className={clsx(
                    'px-4 py-1.5 text-sm font-medium transition-all',
                    block1[item] === false
                      ? 'bg-[var(--navy-700)] text-white'
                      : 'bg-white text-[var(--neutral-600)] hover:bg-[var(--neutral-50)]'
                  )}
                >
                  Não
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloco 2 */}
      <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm p-6 space-y-4">
        <p className="text-xs text-[var(--neutral-400)]">Opcional — selecione todos que se aplicam</p>
        <div className="space-y-2">
          {BLOCK2_ITEMS.map(item => {
            const selected = block2.includes(item.label);
            const isOutro  = item.label === 'Outro';
            return (
              <div key={item.label} className="space-y-2">
                <button
                  onClick={() => onBlock2Toggle(item.label)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left',
                    selected
                      ? 'border-[var(--navy-400)] bg-[var(--navy-50)]'
                      : 'border-[var(--neutral-200)] bg-white hover:border-[var(--neutral-300)]'
                  )}
                >
                  <div className={clsx(
                    'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                    selected ? 'border-[var(--navy-600)] bg-[var(--navy-600)]' : 'border-[var(--neutral-300)]'
                  )}>
                    {selected && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className="text-sm text-[var(--neutral-800)]">{item.label}</span>
                </button>

                {isOutro && selected && (
                  <div className="ml-7 space-y-2">
                    <textarea
                      value={outroText}
                      onChange={e => onOutroChange(e.target.value)}
                      rows={3}
                      placeholder="Descreva o controle..."
                      className="w-full px-3.5 py-3 rounded-xl border border-[var(--neutral-200)] text-sm text-[var(--neutral-900)] placeholder:text-[var(--neutral-300)] outline-none focus:border-[var(--navy-400)] focus:ring-2 focus:ring-[var(--navy-100)] transition-all resize-none"
                    />
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Este controle constará no PGR, mas <strong>não entrará no cálculo do nível de risco</strong> — apenas os itens da lista acima influenciam esse cálculo.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InventarioPage() {
  const router  = useRouter();
  const mainRef = useRef<HTMLElement>(null);

  // ── Prototype toggles ───────────────────────────────────────────────────────
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cipaFilled,        setCipaFilled]        = useState(false);
  const [cipaHasEmail,      setCipaHasEmail]      = useState(true);
  const [isEconomicGroup,   setIsEconomicGroup]   = useState(true);

  // ── Wizard navigation ───────────────────────────────────────────────────────
  const [currentStep,    setCurrentStep]    = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // ── Step 1 state ────────────────────────────────────────────────────────────
  const [reminderSent,   setReminderSent]   = useState(false);
  const [showSkipDetail, setShowSkipDetail] = useState(false);

  // ── Step 2 state ────────────────────────────────────────────────────────────
  const [controlsApplyToAll, setControlsApplyToAll] = useState<boolean | null>(null);
  const [block1,       setBlock1]       = useState<Record<string, boolean | null>>({});
  const [block2,       setBlock2]       = useState<string[]>([]);
  const [outroText,    setOutroText]    = useState('');
  const [cnpjBlock1,   setCnpjBlock1]   = useState<Record<string, Record<string, boolean | null>>>({});
  const [cnpjBlock2,   setCnpjBlock2]   = useState<Record<string, string[]>>({});
  const [cnpjOutroText, setCnpjOutroText] = useState<Record<string, string>>({});

  // ── Step 3 state ────────────────────────────────────────────────────────────
  const [responsibleName, setResponsibleName] = useState('');
  const [responsibleRole, setResponsibleRole] = useState('');
  const [responsibleCert, setResponsibleCert] = useState('');

  // ── Step 4 state ────────────────────────────────────────────────────────────
  const [observations, setObservations] = useState('');

  // ── Save / exit modal ───────────────────────────────────────────────────────
  const [showSaveModal, setShowSaveModal] = useState(false);

  const saveAndExit = () => router.push('/campanhas/1');
  const discardAndExit = () => router.push('/campanhas/1');

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goToStep = (step: number) => {
    setCurrentStep(step);
    setShowSkipDetail(false);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    setCompletedSteps(prev => prev.includes(currentStep) ? prev : [...prev, currentStep]);
    if (currentStep < 4) goToStep(currentStep + 1);
    else router.push('/pgr');
  };

  const handleBack = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
    else router.push('/campanhas/1');
  };

  // ── Can advance ─────────────────────────────────────────────────────────────
  const block1Complete = (b: Record<string, boolean | null>) =>
    BLOCK1_ITEMS.every(item => b[item] === true || b[item] === false);

  const canAdvance =
    currentStep === 1 ? (
      !isEconomicGroup
        ? block1Complete(block1)
        : controlsApplyToAll === true
          ? block1Complete(block1)
          : controlsApplyToAll === false
            ? MOCK_CNPJS.every(c => block1Complete(cnpjBlock1[c.cnpj] ?? {}))
            : false
    ) :
    currentStep === 2 ? responsibleName.trim().length > 0 :
    currentStep === 3 ? true :
    (cipaFilled || showSkipDetail);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex overflow-hidden md:h-screen bg-[var(--surface-subtle)]">
      <AppSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main ref={mainRef} className="flex-1 min-w-0 md:overflow-y-auto relative">

        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <header className="h-14 border-b border-[var(--border)] bg-white px-4 md:px-8 flex items-center justify-between sm:sticky top-0 z-20">
          <div className="flex items-center gap-2 md:gap-4 overflow-hidden flex-1 min-w-0">
            <button
              className="p-2.5 -ml-2 md:hidden text-[var(--text-secondary)]"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors shrink-0"
              onClick={() => router.push('/campanhas/1')}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> {MOCK_CAMPAIGN_NAME}
            </button>
            <span className="hidden sm:block text-[var(--neutral-300)]">/</span>
            <h1 className="font-semibold text-[var(--text-primary)] text-sm truncate">
              Inventário de Riscos (PGR)
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowSaveModal(true)}>
            Salvar e sair
          </Button>
        </header>

        {/* ── Prototype bar ─────────────────────────────────────────────────── */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 md:px-8 py-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 shrink-0">
            <Settings2 className="w-3.5 h-3.5" />
            Protótipo
          </div>
          <div className="h-3.5 w-px bg-amber-200 shrink-0" />
          <label className="flex items-center gap-1.5 text-xs text-amber-700 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={cipaFilled}
              onChange={e => { setCipaFilled(e.target.checked); setShowSkipDetail(false); setReminderSent(false); }}
              className="accent-amber-600"
            />
            CIPA preencheu
          </label>
          {!cipaFilled && (
            <label className="flex items-center gap-1.5 text-xs text-amber-700 cursor-pointer select-none whitespace-nowrap">
              <input
                type="checkbox"
                checked={cipaHasEmail}
                onChange={e => setCipaHasEmail(e.target.checked)}
                className="accent-amber-600"
              />
              Tem e-mail
            </label>
          )}
          <div className="h-3.5 w-px bg-amber-200 shrink-0" />
          <label className="flex items-center gap-1.5 text-xs text-amber-700 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={isEconomicGroup}
              onChange={e => { setIsEconomicGroup(e.target.checked); setControlsApplyToAll(null); }}
              className="accent-amber-600"
            />
            Grupo econômico
          </label>
        </div>

        {/* ── Stepper ───────────────────────────────────────────────────────── */}
        <div className="sm:sticky top-14 z-10 bg-white border-b border-[var(--border)] py-4">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <Stepper
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={goToStep}
            />
          </div>
        </div>

        {/* ── Step content ──────────────────────────────────────────────────── */}
        <div className="p-4 md:p-8 max-w-5xl mx-auto">

          {/* ── Step 4: CIPA ──────────────────────────────────────────────── */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl md:text-2xl font-bold text-[var(--neutral-900)] mb-2">
                  Representante da CIPA
                </h2>
                <p className="text-[var(--neutral-600)]">
                  O representante indicado na campanha precisa ter respondido o formulário para que sua perspectiva seja incluída no inventário.
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

                {/* Card 1: aguardar representante */}
                <div
                  onClick={() => !cipaFilled && setShowSkipDetail(false)}
                  className={clsx(
                    'rounded-2xl border-2 p-6 space-y-4 transition-all',
                    cipaFilled
                      ? 'border-emerald-300 bg-emerald-50 cursor-default'
                      : !showSkipDetail
                        ? 'border-[var(--navy-400)] bg-[var(--navy-50)] cursor-pointer'
                        : 'border-[var(--neutral-200)] bg-white cursor-pointer hover:border-[var(--neutral-300)] hover:bg-[var(--neutral-50)]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--neutral-100)] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-[var(--neutral-400)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[var(--neutral-900)]">{MOCK_CIPA_REP.name}</p>
                      <p className="text-xs text-[var(--neutral-400)] mt-0.5">{MOCK_CIPA_REP.group}</p>
                      {cipaHasEmail && (
                        <p className="text-xs text-[var(--neutral-400)]">{MOCK_CIPA_REP.email}</p>
                      )}
                    </div>
                    {cipaFilled ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Preencheu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                        <AlertTriangle className="w-3 h-3" /> Pendente
                      </span>
                    )}
                  </div>

                  {!cipaFilled && (
                    <>
                      <p className="text-xs text-[var(--neutral-400)] pt-3 border-t border-[var(--neutral-100)]">
                        Formulário enviado em {MOCK_CIPA_REP.sentAt}
                      </p>
                      {cipaHasEmail && (
                        <Button
                          variant="outline"
                          size="sm"
                          className={clsx('gap-2 w-full justify-center', reminderSent && 'border-emerald-300 text-emerald-700')}
                          onClick={e => { e.stopPropagation(); setReminderSent(true); }}
                          disabled={reminderSent}
                        >
                          {reminderSent
                            ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Lembrete enviado</>
                            : <><Bell className="w-3.5 h-3.5" /> Enviar lembrete</>}
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {/* Card 2: continuar sem o representante */}
                <div
                  onClick={() => !cipaFilled && setShowSkipDetail(true)}
                  className={clsx(
                    'rounded-2xl border-2 p-6 space-y-4 transition-all',
                    cipaFilled
                      ? 'border-[var(--neutral-100)] bg-[var(--neutral-50)] opacity-40 cursor-not-allowed'
                      : showSkipDetail
                        ? 'border-[var(--navy-400)] bg-[var(--navy-50)] cursor-pointer'
                        : 'border-[var(--neutral-200)] bg-white cursor-pointer hover:border-[var(--neutral-300)] hover:bg-[var(--neutral-50)]'
                  )}
                >
                  <p className="font-semibold text-sm text-[var(--neutral-900)]">
                    Continuar sem o representante
                  </p>

                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-1.5">
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                      O que constará no inventário
                    </p>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      O questionário para <strong>{MOCK_CIPA_REP.name}</strong> foi enviado em{' '}
                      {MOCK_CIPA_REP.sentAt} porém não foi respondido até a data de geração deste inventário.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] p-4 space-y-1.5">
                    <p className="text-[10px] font-bold text-[var(--neutral-500)] uppercase tracking-wider">
                      Isso não é definitivo
                    </p>
                    <p className="text-xs text-[var(--neutral-600)] leading-relaxed">
                      Você pode gerar o inventário agora e continuar cumprindo as pendências no seu ritmo.
                      Após o representante preencher, é possível gerar uma versão atualizada — as informações
                      já preenchidas serão mantidas.
                    </p>
                  </div>
                </div>

              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-100)]">
                <Button variant="ghost" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button variant="primary" onClick={handleNext} disabled={!canAdvance} className="gap-2">
                  Avançar <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 1: Controles ─────────────────────────────────────────── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl md:text-2xl font-bold text-[var(--neutral-900)] mb-2">
                  Controles existentes
                </h2>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-[var(--neutral-600)]">
                    São medidas, práticas ou mecanismos que a empresa já possui para prevenir, reduzir ou tratar riscos psicossociais no trabalho.
                  </p>
                  <p className="text-sm text-[var(--neutral-600)]">
                    As informações preenchidas aqui serão usadas no cálculo do nível de risco.
                  </p>
                </div>
              </section>

              {/* Economic group question */}
              {isEconomicGroup && (
                <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm p-6">
                  <p className="font-semibold text-[var(--neutral-900)] mb-4">
                    Os controles existentes são os mesmos para todos os CNPJs do grupo?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setControlsApplyToAll(true)}
                      className={clsx(
                        'rounded-xl border-2 p-4 text-left transition-all',
                        controlsApplyToAll === true
                          ? 'border-[var(--navy-400)] bg-[var(--navy-50)]'
                          : 'border-[var(--neutral-200)] bg-white hover:border-[var(--navy-300)] hover:bg-[var(--navy-50)]'
                      )}
                    >
                      <p className="font-semibold text-sm text-[var(--neutral-900)]">Sim, são os mesmos</p>
                      <p className="text-xs text-[var(--neutral-400)] mt-0.5">Uma declaração cobre todos os CNPJs</p>
                    </button>
                    <button
                      onClick={() => setControlsApplyToAll(false)}
                      className={clsx(
                        'rounded-xl border-2 p-4 text-left transition-all',
                        controlsApplyToAll === false
                          ? 'border-[var(--navy-400)] bg-[var(--navy-50)]'
                          : 'border-[var(--neutral-200)] bg-white hover:border-[var(--navy-300)] hover:bg-[var(--navy-50)]'
                      )}
                    >
                      <p className="font-semibold text-sm text-[var(--neutral-900)]">Não, cada CNPJ tem os seus</p>
                      <p className="text-xs text-[var(--neutral-400)] mt-0.5">Declaração individual por empresa</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Single controls form */}
              {(!isEconomicGroup || controlsApplyToAll === true) && (
                <ControlsForm
                  block1={block1}
                  block2={block2}
                  outroText={outroText}
                  onOutroChange={setOutroText}
                  label={controlsApplyToAll === true ? 'Todos os CNPJs' : undefined}
                  onBlock1Change={(key, val) => setBlock1(prev => ({ ...prev, [key]: val }))}
                  onBlock2Toggle={key => setBlock2(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
                />
              )}

              {/* Per-CNPJ cards */}
              {isEconomicGroup && controlsApplyToAll === false && (
                <div className="space-y-6">
                  {MOCK_CNPJS.map(company => (
                    <div key={company.cnpj} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--neutral-100)] flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-[var(--neutral-400)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[var(--neutral-900)]">{company.name}</p>
                          <p className="text-xs text-[var(--neutral-400)] font-mono mt-0.5">{company.cnpj}</p>
                        </div>
                        {block1Complete(cnpjBlock1[company.cnpj] ?? {}) && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <ControlsForm
                        block1={cnpjBlock1[company.cnpj] ?? {}}
                        block2={cnpjBlock2[company.cnpj] ?? []}
                        outroText={cnpjOutroText[company.cnpj] ?? ''}
                        onOutroChange={val => setCnpjOutroText(prev => ({ ...prev, [company.cnpj]: val }))}
                        onBlock1Change={(key, val) =>
                          setCnpjBlock1(prev => ({
                            ...prev,
                            [company.cnpj]: { ...(prev[company.cnpj] ?? {}), [key]: val },
                          }))
                        }
                        onBlock2Toggle={key =>
                          setCnpjBlock2(prev => {
                            const cur = prev[company.cnpj] ?? [];
                            return {
                              ...prev,
                              [company.cnpj]: cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key],
                            };
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-100)]">
                <Button variant="ghost" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Cancelar
                </Button>
                <Button variant="primary" onClick={handleNext} disabled={!canAdvance} className="gap-2">
                  Avançar <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 2: Responsável ───────────────────────────────────────── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl md:text-2xl font-bold text-[var(--neutral-900)] mb-2">
                  Responsável pela assinatura
                </h2>
                <p className="text-[var(--neutral-600)]">
                  Informe os dados de quem assinará tecnicamente o PGR.
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm p-6 space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[var(--neutral-800)]">
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={responsibleName}
                      onChange={e => setResponsibleName(e.target.value)}
                      placeholder="Ex.: Dra. Ana Paula Ferreira"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm text-[var(--neutral-900)] placeholder:text-[var(--neutral-300)] outline-none focus:border-[var(--navy-400)] focus:ring-2 focus:ring-[var(--navy-100)] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[var(--neutral-800)]">
                      Cargo / Função{' '}
                      <span className="text-xs font-normal text-[var(--neutral-400)]">opcional</span>
                    </label>
                    <input
                      type="text"
                      value={responsibleRole}
                      onChange={e => setResponsibleRole(e.target.value)}
                      placeholder="Ex.: Médico do Trabalho, Engenheiro de Segurança"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm text-[var(--neutral-900)] placeholder:text-[var(--neutral-300)] outline-none focus:border-[var(--navy-400)] focus:ring-2 focus:ring-[var(--navy-100)] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[var(--neutral-800)]">
                      Número de certificação{' '}
                      <span className="text-xs font-normal text-[var(--neutral-400)]">opcional</span>
                    </label>
                    <input
                      type="text"
                      value={responsibleCert}
                      onChange={e => setResponsibleCert(e.target.value)}
                      placeholder="Ex.: CRM 12345/SP, CREA 67890/MG"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm text-[var(--neutral-900)] placeholder:text-[var(--neutral-300)] outline-none focus:border-[var(--navy-400)] focus:ring-2 focus:ring-[var(--navy-100)] transition-all"
                    />
                    <p className="text-xs text-[var(--neutral-400)]">
                      CRM, CREA, CRBM ou equivalente conforme a formação do responsável.
                    </p>
                  </div>
                </div>

                {/* Right: info panel */}
                <div className="rounded-2xl border border-[var(--navy-200)] bg-[var(--navy-50)] p-5 space-y-3">
                  <p className="text-xs font-bold text-[var(--navy-700)] uppercase tracking-wider">
                    Por que solicitamos isso?
                  </p>
                  <p className="text-sm text-[var(--navy-800)] leading-relaxed">
                    O responsável técnico é o profissional que atesta a validade do PGR perante a legislação.
                    Seus dados aparecem no documento gerado e conferem credibilidade técnica ao inventário.
                  </p>
                  <p className="text-sm text-[var(--navy-800)] leading-relaxed">
                    O número de certificação (CRM, CREA, etc.) é opcional mas recomendado para documentos
                    que serão apresentados em auditorias ou fiscalizações.
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-100)]">
                <Button variant="ghost" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button variant="primary" onClick={handleNext} disabled={!canAdvance} className="gap-2">
                  Avançar <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Observações ───────────────────────────────────────── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl md:text-2xl font-bold text-[var(--neutral-900)] mb-2">
                  Observações
                </h2>
                <p className="text-[var(--neutral-600)]">
                  Adicione qualquer informação complementar que deva constar no inventário. Este campo é opcional.
                </p>
              </section>

              <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm p-6">
                <label className="block">
                  <p className="text-sm font-semibold text-[var(--neutral-800)] mb-2">
                    Observações adicionais{' '}
                    <span className="text-xs font-normal text-[var(--neutral-400)]">opcional</span>
                  </p>
                  <textarea
                    value={observations}
                    onChange={e => setObservations(e.target.value)}
                    rows={7}
                    placeholder="Ex.: particularidades do ambiente de trabalho, histórico de acidentes relevante, contexto organizacional, pendências que serão resolvidas em breve..."
                    className="w-full px-3.5 py-3 rounded-xl border border-[var(--neutral-200)] text-sm text-[var(--neutral-900)] placeholder:text-[var(--neutral-300)] outline-none focus:border-[var(--navy-400)] focus:ring-2 focus:ring-[var(--navy-100)] transition-all resize-none"
                  />
                </label>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-100)]">
                <Button variant="ghost" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button variant="primary" onClick={handleNext} className="gap-2">
                  Concluir <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Save / exit modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Sair do inventário"
        size="sm"
        footer={
          <div className="flex flex-col gap-2">
            <Button variant="primary" size="md" className="w-full justify-center gap-2" onClick={saveAndExit}>
              <Bookmark className="w-4 h-4" />
              Salvar progresso e sair
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-center text-red-500 hover:text-red-700 hover:bg-red-50" onClick={discardAndExit}>
              Descartar e sair
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[var(--neutral-600)]">
          O progresso preenchido até aqui pode ser salvo como rascunho e continuado depois.
        </p>
      </Modal>
    </div>
  );
}
