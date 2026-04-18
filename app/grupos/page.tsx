'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Menu, HelpCircle, CalendarDays, Video, MessageCircle, CheckCircle2 } from 'lucide-react';
import { AppSidebar } from '@/components/fluir/app-sidebar';
import { Stepper } from '@/components/fluir/stepper';
import { Button } from '@/components/fluir/button';
import { Badge } from '@/components/fluir/badge';
import { Modal } from '@/components/fluir/modal';

const STEPS = [
  { id: '1', label: 'Participantes' },
  { id: '2', label: 'Grupos' },
  { id: '3', label: 'Duração' },
  { id: '4', label: 'Revisão' },
];

export default function GruposPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex overflow-hidden md:h-screen bg-[var(--surface-subtle)]">
      <AppSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main ref={mainRef} className="flex-1 min-w-0 md:overflow-y-auto relative">
        {/* Top bar */}
        <header className="h-14 border-b border-[var(--border)] bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 md:gap-4 overflow-hidden flex-1 min-w-0">
            <button
              className="p-2.5 -ml-2 md:hidden text-[var(--text-secondary)]"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              onClick={() => router.push('/grupos')}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Grupos
            </button>
            <span className="hidden sm:block text-[var(--neutral-300)]">/</span>
            <div className="flex items-center gap-2 overflow-hidden min-w-0">
              <h1 className="font-semibold text-[var(--text-primary)] truncate text-sm">Novo Grupo</h1>
              <Badge variant="neutral" className="text-[10px] px-1.5 h-5 font-medium">Rascunho</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowHelp(true)}>
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Precisa de ajuda?</span>
            </Button>
            <Button variant="ghost" size="sm">
              Salvar e sair
            </Button>
          </div>
        </header>

        {/* Stepper bar */}
        <div className="sticky top-14 z-10 bg-white border-b border-[var(--border)] px-4 md:px-8 py-4">
          <div className="max-w-5xl mx-auto">
            <div className="hidden sm:block">
              <Stepper steps={STEPS} currentStep={currentStep} onStepClick={goToStep} />
            </div>
            <div className="sm:hidden flex items-center gap-3">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase shrink-0">Etapa 0{currentStep}/04</span>
              <span className="text-[var(--neutral-300)]">·</span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">{STEPS[currentStep - 1].label}</span>
            </div>
          </div>
        </div>

        {/* Content placeholder */}
        <div className="p-4 md:p-8 max-w-5xl mx-auto" />
      </main>

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
