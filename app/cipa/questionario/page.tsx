'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { FluirLogo } from '@/components/fluir/logo';
import { Button } from '@/components/fluir/button';

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    num: 1,
    total: 24,
    category: 'Organização do Trabalho',
    text: 'A empresa possui análise formal de carga de trabalho de seus colaboradores?',
    options: ['Não', 'Parcial', 'Sim'],
  },
  {
    id: 2,
    num: 8,
    total: 24,
    category: 'PGR e Riscos Psicossociais',
    text: 'Riscos psicossociais estão explicitamente inclusos no PGR?',
    options: ['Não', 'Parcial', 'Sim'],
  },
  {
    id: 3,
    num: 13,
    total: 24,
    category: 'Assédio e Conflitos',
    text: 'Existe política formal de prevenção a assédio moral e sexual?',
    options: ['Não', 'Parcial', 'Sim'],
  },
  {
    id: 4,
    num: 18,
    total: 24,
    category: 'Capacitação',
    text: 'CIPA foi treinada sobre riscos psicossociais?',
    options: ['Não', 'Parcial', 'Sim'],
  },
  {
    id: 5,
    num: 23,
    total: 24,
    category: 'Perspectiva da CIPA',
    text: 'Existe divergência entre o que a CIPA relata como controles e o que os colaboradores relatam?',
    options: ['Não há divergência', 'Divergências em alguns pontos', 'Divergências significativas'],
  },
];

// ─── Option card ──────────────────────────────────────────────────────────────

function OptionCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%',
        padding: '14px 16px', borderRadius: 10,
        border: selected ? '2px solid var(--navy-700)' : '1px solid var(--neutral-200)',
        background: selected ? '#f5f3fa' : 'white',
        cursor: 'pointer', textAlign: 'left', transition: 'all 150ms',
        fontFamily: 'inherit',
      }}
    >
      <span style={{
        flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
        border: selected ? '2px solid var(--navy-700)' : '2px solid var(--neutral-400)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'white',
      }}>
        {selected && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--navy-700)', display: 'block' }} />}
      </span>
      <span style={{ fontSize: 15, color: selected ? 'var(--navy-900, #1e1a27)' : 'var(--neutral-700)', fontWeight: selected ? 500 : 400 }}>
        {label}
      </span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CipaQuestionarioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nome = searchParams.get('nome') || 'Representante';

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const q = QUESTIONS[current];
  const selected = answers[q.id];
  const answeredCount = Object.keys(answers).length + (selected && !answers[q.id] ? 1 : 0);
  const pct = Math.round((current / QUESTIONS.length) * 100);

  function handleNext() {
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      router.push(`/cipa/obrigado?nome=${encodeURIComponent(nome)}`);
    }
  }

  function handleBack() {
    if (current === 0) {
      router.push(`/cipa/antes-de-comecar?nome=${encodeURIComponent(nome)}`);
    } else {
      setCurrent(c => c - 1);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--neutral-50, #f8f8f9)',
      display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)',
    }}>

      {/* Header */}
      <header style={{
        background: 'white', borderBottom: '1px solid var(--neutral-200)',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <FluirLogo variant="color" height={28} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 14 }}>
          <button
            onClick={() => router.push(`/cipa?nome=${encodeURIComponent(nome)}`)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-600)', fontWeight: 500, fontSize: 14, padding: 0, fontFamily: 'inherit' }}
          >
            ← Meus questionários
          </button>
          <span style={{ color: 'var(--neutral-300)' }}>|</span>
          <button
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-500)', fontWeight: 500, fontSize: 14, padding: 0, fontFamily: 'inherit' }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 700 }}>
          <div style={{
            background: 'white', borderRadius: 16,
            border: '1px solid var(--neutral-200)',
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)',
            padding: '32px 40px 36px',
          }}>

            {/* Progress */}
            <div style={{ height: 6, borderRadius: 99, background: 'var(--neutral-100)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 99, background: '#42b6a4', width: `${pct}%`, transition: 'width 0.3s' }} />
            </div>
            <p style={{ margin: '8px 0 24px', fontSize: 13, color: 'var(--neutral-500)' }}>
              Pergunta {q.num} de {q.total}
            </p>

            {/* Category hint */}
            <div style={{ background: 'var(--neutral-50)', border: '1.5px solid var(--neutral-200)', borderRadius: 10, padding: '13px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ flexShrink: 0, width: 4, height: 36, borderRadius: 4, background: 'var(--neutral-300)', display: 'block' }} />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--neutral-500)', lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {q.category}
              </p>
            </div>

            {/* Question */}
            <p style={{ margin: '0 0 24px', fontSize: 19, fontWeight: 700, color: 'var(--neutral-900)', lineHeight: 1.35 }}>
              {q.text}
            </p>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
              {q.options.map(opt => (
                <OptionCard
                  key={opt}
                  label={opt}
                  selected={selected === opt}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                />
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 100 }}
              >
                <ArrowLeft size={15} /> Voltar
              </Button>
              <Button size="lg" style={{ flex: 1 }} disabled={!selected} onClick={handleNext}>
                {current < QUESTIONS.length - 1 ? 'Avançar' : 'Concluir'}
              </Button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '20px 16px 28px', flexShrink: 0, borderTop: '1px solid var(--neutral-200)' }}>
        <p style={{ fontSize: 13, color: 'var(--neutral-500)', margin: 0 }}>
          Suas respostas são confidenciais e utilizadas exclusivamente para fins de pesquisa organizacional
        </p>
      </footer>

    </div>
  );
}

export default function CipaQuestionarioPage() {
  return <Suspense><CipaQuestionarioContent /></Suspense>;
}
