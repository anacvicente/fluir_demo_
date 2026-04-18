'use client';

import { useState, Suspense } from 'react';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FluirLogo } from '@/components/fluir/logo';
import { Button } from '@/components/fluir/button';
import { ProgressBar } from '@/components/fluir/progress-bar';
import type { ContextVariant, Question } from '@/types/questionario';

// ─── Context color map ─────────────────────────────────────────────────────────

const CONTEXT_STYLES: Record<ContextVariant, { bg: string; border: string; text: string }> = {
  purple: { bg: '#f3f0fa', border: '#c4b5e8', text: '#4b3b70' },
  green:  { bg: '#edf7f0', border: '#86c9a0', text: '#276749' },
  blue:   { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8' },
  amber:  { bg: '#fffbeb', border: '#fcd34d', text: '#92400e' },
};

// ─── Prototype data ────────────────────────────────────────────────────────────
// TODO (backend integration): replace QUESTIONS and TOTAL_QUESTIONS with a call
// to loadSession() from @/services/questionario — see that file for the API contract.

const TOTAL_QUESTIONS = 56;

const QUESTIONS: Question[] = [
  {
    id: 1,
    questionNumber: 1,
    context: <>Pense em como tem sido <strong>seu trabalho nos últimos meses</strong></>,
    contextVariant: 'purple',
    text: 'No seu trabalho existem medidas, ações e/ou campanhas de promoção da segurança mental, saúde e bem-estar?',
    options: ['Nunca / quase nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
  },
  {
    id: 2,
    questionNumber: 2,
    context: <>Pense em como tem sido <strong>seu trabalho nos últimos meses</strong></>,
    contextVariant: 'purple',
    text: 'Você se sente apoiado pela sua liderança direta quando enfrenta dificuldades no trabalho?',
    options: ['Nunca / quase nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
  },
  {
    id: 3,
    questionNumber: 40,
    context: <>Pense nas <strong>últimas 4 semanas</strong></>,
    contextVariant: 'green',
    text: 'Você acordou várias vezes durante a noite e depois não conseguiu adormecer novamente?',
    options: ['Nunca / quase nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
  },
  {
    id: 4,
    questionNumber: 46,
    context: <>Pense nos <strong>últimos 12 meses</strong></>,
    contextVariant: 'amber',
    text: 'Assistiu situações de discriminação, assédio (moral ou sexual) ou violência?',
    options: ['Nunca / quase nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
  },
];

// ─── Context hint card ─────────────────────────────────────────────────────────

function ContextHint({ text, variant }: { text: React.ReactNode; variant: ContextVariant }) {
  const s = CONTEXT_STYLES[variant];
  return (
    <div style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 10, padding: '13px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ flexShrink: 0, width: 4, height: 36, borderRadius: 4, background: s.border, display: 'block' }} />
      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: s.text, lineHeight: 1.4 }}>{text}</p>
    </div>
  );
}

// ─── Likert option row ─────────────────────────────────────────────────────────

function LikertOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%',
        padding: '14px 16px', borderRadius: 10,
        border: selected ? '2px solid var(--navy-700)' : '1px solid var(--neutral-200)',
        background: selected ? '#f5f3fa' : 'white',
        cursor: 'pointer', textAlign: 'left', transition: 'all 150ms', fontFamily: 'inherit',
      }}
    >
      <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', border: selected ? '2px solid var(--navy-700)' : '2px solid var(--neutral-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
        {selected && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--navy-700)', display: 'block' }} />}
      </span>
      <span style={{ fontSize: 15, color: selected ? 'var(--navy-900, #1e1a27)' : 'var(--neutral-700)', fontWeight: selected ? 500 : 400 }}>
        {label}
      </span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function PerguntasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nome = searchParams.get('nome') || 'Trabalhador';

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const question = QUESTIONS[current];
  const selectedAnswer = answers[question.id];

  function handleAvancar() {
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      router.push(`/questionario/obrigado?nome=${encodeURIComponent(nome)}`);
    }
  }

  function handleVoltar() {
    if (current === 0) {
      router.push(`/questionario/antes-de-comecar?nome=${encodeURIComponent(nome)}`);
    } else {
      setCurrent(c => c - 1);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--neutral-50, #f8f8f9)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--neutral-200)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <FluirLogo variant="color" height={28} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
          <span style={{ color: 'var(--neutral-700)', fontWeight: 500 }}>Olá, {nome}</span>
          <span style={{ color: 'var(--neutral-300)' }}>|</span>
          <button onClick={() => router.push('/questionario')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-600)', fontWeight: 500, fontSize: 14, padding: 0, fontFamily: 'inherit' }}>
            Sair
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 700 }}>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--neutral-200)', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)', padding: '32px 40px 36px' }}>

            <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: 'var(--navy-600, #6b5b8a)' }}>
              Pesquisa em andamento
            </p>

            <ProgressBar value={question.questionNumber} max={TOTAL_QUESTIONS} size="sm" showValue={false} animated />

            <p style={{ margin: '8px 0 24px', fontSize: 13, color: 'var(--neutral-500)' }}>
              Pergunta {question.questionNumber} de {TOTAL_QUESTIONS}
            </p>

            <ContextHint text={question.context} variant={question.contextVariant} />

            <p style={{ margin: '0 0 24px', fontSize: 19, fontWeight: 700, color: 'var(--neutral-900)', lineHeight: 1.35 }}>
              {question.text}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
              {question.options.map(option => (
                <LikertOption key={option} label={option} selected={selectedAnswer === option} onClick={() => setAnswers(prev => ({ ...prev, [question.id]: option }))} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="outline" size="lg" onClick={handleVoltar} style={{ minWidth: 100 }}>Voltar</Button>
              <Button size="lg" style={{ flex: 1 }} disabled={!selectedAnswer} onClick={handleAvancar}>Avançar</Button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '20px 16px 28px', flexShrink: 0, borderTop: '1px solid var(--neutral-200)' }}>
        <p style={{ fontSize: 13, color: 'var(--neutral-500)', margin: 0 }}>
          Suas respostas são confidenciais e serão utilizadas apenas para fins de pesquisa organizacional
        </p>
      </footer>

    </div>
  );
}

export default function PerguntasPage() {
  return <Suspense><PerguntasContent /></Suspense>;
}
