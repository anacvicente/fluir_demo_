'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Menu, HelpCircle, CalendarDays, Video, MessageCircle, CheckCircle2, Bookmark } from 'lucide-react';
import { AppSidebar } from '@/components/fluir/app-sidebar';
import { Stepper } from '@/components/fluir/stepper';
import { Button } from '@/components/fluir/button';
import { Badge } from '@/components/fluir/badge';
import { Modal } from '@/components/fluir/modal';
import StepPrepareBase from '@/components/fluir/steps/StepPrepareBase';
import Step2Groups, { type GroupWithCriterion } from '@/components/fluir/steps/Step2Groups';
import Step3Cipa, { type CipaData } from '@/components/fluir/steps/Step3Cipa';
import Step4Duration, { type DurationData } from '@/components/fluir/steps/Step4Duration';
import Step5Review from '@/components/fluir/steps/Step5Review';

const STEPS = [
  { id: '1', label: 'Base' },
  { id: '2', label: 'Grupos' },
  { id: '3', label: 'CIPA' },
  { id: '4', label: 'Duração' },
  { id: '5', label: 'Revisão' },
];

export default function NovaCampanhaPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [showSaveDraft, setShowSaveDraft] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState<{ groups?: GroupWithCriterion[]; cipa?: CipaData; duration?: DurationData }>({});
  const mainRef = useRef<HTMLElement>(null);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = (stepData?: Partial<typeof campaignData>) => {
    if (stepData) setCampaignData(prev => ({ ...prev, ...stepData }));
    setCompletedSteps(prev => prev.includes(currentStep) ? prev : [...prev, currentStep]);
    goToStep(currentStep + 1);
  };

  const handleBack = () => {
    goToStep(currentStep - 1);
  };

  const openSaveModal = (href?: string) => {
    setPendingHref(href ?? '/campanhas');
    setShowSaveDraft(true);
  };

  const handleBeforeNavigate = (href: string): boolean => {
    openSaveModal(href);
    return false; // cancel navigation, modal handles it
  };

  const saveDraft = () => {
    const name = campaignName.trim() || 'Campanha sem nome';
    const drafts = JSON.parse(localStorage.getItem('fluir_campaign_drafts') || '[]');
    drafts.unshift({
      id: Date.now().toString(),
      name,
      currentStep,
      completedSteps,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem('fluir_campaign_drafts', JSON.stringify(drafts));
    router.push(pendingHref ?? '/campanhas');
  };

  const discard = () => {
    router.push(pendingHref ?? '/campanhas');
  };

  return (
    <div className="flex overflow-hidden md:h-screen bg-[var(--surface-subtle)]">
      <AppSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onBeforeNavigate={handleBeforeNavigate}
      />

      <main ref={mainRef} className="flex-1 min-w-0 md:overflow-y-auto relative">
        {/* Top bar */}
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
              onClick={() => openSaveModal('/campanhas')}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Campanhas
            </button>
            <span className="hidden sm:block text-[var(--neutral-300)]">/</span>
            <div className="flex items-center gap-2 overflow-hidden min-w-0">
              <h1 className="font-semibold text-[var(--text-primary)] truncate text-sm">Nova Campanha</h1>
              <Badge variant="neutral" className="text-[10px] px-1.5 h-5 font-medium shrink-0">Rascunho</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowHelp(true)}>
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Precisa de ajuda?</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => openSaveModal('/campanhas')}>
              <span className="hidden sm:inline">Salvar e </span>Sair
            </Button>
          </div>
        </header>

        {/* Stepper bar */}
        <div className="sm:sticky top-14 z-10 bg-white border-b border-[var(--border)] py-4">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <Stepper steps={STEPS} currentStep={currentStep} onStepClick={goToStep} />
          </div>
        </div>

        {/* Step content */}
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          {currentStep === 1 && <StepPrepareBase onNext={handleNext} />}
          {currentStep === 2 && (
            <Step2Groups
              initialGroups={campaignData.groups}
              onNext={(groups) => handleNext({ groups })}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <Step3Cipa
              initialData={campaignData.cipa}
              onNext={(cipa) => handleNext({ cipa })}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <Step4Duration
              initialData={campaignData.duration}
              onNext={(duration) => handleNext({ duration })}
              onBack={handleBack}
            />
          )}
          {currentStep === 5 && (
            <Step5Review
              groups={campaignData.groups}
              cipa={campaignData.cipa}
              duration={campaignData.duration}
              onBack={handleBack}
              onActivate={() => router.push('/campanhas/ac-1?ativada=true')}
              onEditStep={goToStep}
            />
          )}
        </div>
      </main>

      {/* Save draft modal */}
      <Modal
        isOpen={showSaveDraft}
        onClose={() => setShowSaveDraft(false)}
        title="Salvar rascunho"
        size="sm"
        footer={
          <div className="flex flex-col gap-2">
            <Button variant="primary" size="md" className="w-full justify-center gap-2" onClick={saveDraft}>
              <Bookmark className="w-4 h-4" />
              Salvar rascunho
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-center text-red-500 hover:text-red-700 hover:bg-red-50" onClick={discard}>
              Descartar e sair
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--neutral-600)]">
            Para salvar, dê um nome para a campanha.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wide">
              Nome da campanha
            </label>
            <input
              type="text"
              autoFocus
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveDraft()}
              placeholder="Ex: Mapeamento 2025.1"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm text-[var(--neutral-900)] placeholder:text-[var(--neutral-400)] outline-none focus:border-[var(--navy-500)] focus:ring-2 focus:ring-[var(--navy-100)] transition-all"
            />
          </div>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Onboarding assistido"
        description="Nosso time de especialistas pode te guiar durante toda a configuração."
        size="sm"
        footer={
          <div className="flex flex-col gap-2">
            <Button variant="primary" size="md" className="w-full justify-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Agendar sessão gratuita
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-center" onClick={() => setShowHelp(false)}>
              Continuar sozinho
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--neutral-600)]">
            Se estiver com dúvidas na configuração da campanha, um especialista Fluir pode participar ao vivo e te ajudar a finalizar tudo certo.
          </p>
          <ul className="space-y-3">
            {[
              { icon: Video,         text: 'Sessão por videochamada, no seu horário' },
              { icon: CheckCircle2,  text: 'Configuração personalizada para o seu negócio' },
              { icon: MessageCircle, text: 'Tire dúvidas em tempo real com quem conhece a plataforma' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-full bg-[var(--navy-100)] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[var(--navy-700)]" />
                </div>
                <span className="text-sm text-[var(--neutral-700)]">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
