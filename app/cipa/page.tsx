'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, FlaskConical, AlertTriangle, CalendarClock, LogOut, Check } from 'lucide-react';
import { FluirLogo } from '@/components/fluir/logo';
import { Button } from '@/components/fluir/button';
import { Alert } from '@/components/fluir/alert';
import { InfoBox } from '@/components/fluir/info-box';

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionarioStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

// ─── Mock ─────────────────────────────────────────────────────────────────────

const PRAZO = '20/04/2025';
const DIAS_RESTANTES = 3;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusLabel(status: QuestionarioStatus) {
  if (status === 'concluido')    return 'Concluído';
  if (status === 'em_andamento') return 'Em andamento';
  return 'Não iniciado';
}

function buttonLabel(status: QuestionarioStatus) {
  if (status === 'em_andamento') return 'Continuar';
  return 'Iniciar';
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--neutral-500)' }}>
          {value} de {total} perguntas respondidas
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--neutral-700)' }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: 'var(--neutral-100)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: 'var(--emerald-600)',
          width: `${pct}%`, transition: 'width 0.3s',
        }} />
      </div>
    </div>
  );
}

function DeadlinePill({ dias }: { dias: number }) {
  const urgent  = dias <= 3;
  const warning = dias <= 7 && dias > 3;
  const bg     = urgent ? 'var(--error-bg)'  : warning ? 'var(--warning-bg)'  : 'var(--success-bg)';
  const color  = urgent ? 'var(--critical)'  : warning ? '#92400e'            : 'var(--emerald-900)';
  const border = urgent ? '#fca5a5'          : warning ? '#fde68a'            : 'var(--emerald-200)';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 99,
      background: bg, color, border: `1px solid ${border}`,
    }}>
      {urgent ? <AlertTriangle size={12} /> : <CalendarClock size={12} />}
      Prazo: {PRAZO} · {dias === 0 ? 'Último dia!' : dias === 1 ? '1 dia restante' : `${dias} dias restantes`}
    </span>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function CipaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nome = searchParams.get('nome') || 'Representante';

  const [mapeamentoRespondidas, setMapeamentoRespondidas] = useState(0);
  const [cipaRespondidas, setCipaRespondidas]             = useState(0);
  const [diasRestantes, setDiasRestantes]                 = useState(DIAS_RESTANTES);
  const TOTAL_MAPEAMENTO = 56;
  const TOTAL_CIPA       = 24;

  function getStatus(respondidas: number, total: number): QuestionarioStatus {
    if (respondidas === 0)    return 'nao_iniciado';
    if (respondidas >= total) return 'concluido';
    return 'em_andamento';
  }

  const cipaDone       = cipaRespondidas >= TOTAL_CIPA;
  const mapeamentoDone = mapeamentoRespondidas >= TOTAL_MAPEAMENTO;

  // InfoBox variant: urgent (≤7d) → risk (amber), otherwise → documentation (navy)
  const urgentVariant = diasRestantes <= 7 ? 'risk' : 'documentation';
  const cipaVariant   = cipaDone ? 'documentation' : urgentVariant;
  const mapVariant    = mapeamentoDone ? 'documentation' : urgentVariant;

  const cipaStatus = getStatus(cipaRespondidas, TOTAL_CIPA);
  const mapStatus  = getStatus(mapeamentoRespondidas, TOTAL_MAPEAMENTO);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--neutral-50)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
    }}>

      {/* Header */}
      <header style={{
        background: 'white', borderBottom: '1px solid var(--neutral-200)',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <FluirLogo variant="color" height={28} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 14, color: 'var(--neutral-600)', fontWeight: 500 }}>
            Pesquisa organizacional
          </span>
          <button
            onClick={() => router.push('/')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 500, color: 'var(--neutral-500)',
              background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--neutral-800)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--neutral-500)')}
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </header>

      {/* Prototype bar */}
      <div style={{
        background: 'var(--warning-bg)', borderBottom: '1px solid #fde68a',
        padding: '8px 32px', display: 'flex', alignItems: 'center', gap: 16,
        fontSize: 12, color: '#92400e', flexWrap: 'wrap',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
          <FlaskConical size={13} /> Protótipo
        </span>
        <span style={{ width: 1, height: 14, background: '#fde68a' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          Dias restantes:
          <input type="range" min={0} max={30} value={diasRestantes}
            onChange={e => setDiasRestantes(Number(e.target.value))} style={{ width: 80 }} />
          <strong>{diasRestantes}</strong>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          Mapeamento:
          <input type="range" min={0} max={TOTAL_MAPEAMENTO} value={mapeamentoRespondidas}
            onChange={e => setMapeamentoRespondidas(Number(e.target.value))} style={{ width: 80 }} />
          <strong>{mapeamentoRespondidas}/{TOTAL_MAPEAMENTO}</strong>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          CIPA:
          <input type="range" min={0} max={TOTAL_CIPA} value={cipaRespondidas}
            onChange={e => setCipaRespondidas(Number(e.target.value))} style={{ width: 80 }} />
          <strong>{cipaRespondidas}/{TOTAL_CIPA}</strong>
        </label>
      </div>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', alignItems: cipaDone && mapeamentoDone ? 'center' : 'flex-start', justifyContent: 'center', padding: '48px 16px' }}>
        {cipaDone && mapeamentoDone ? (
          <div style={{ width: '100%', maxWidth: 560 }}>
            <div style={{
              background: 'white',
              borderRadius: 16,
              border: '1px solid var(--neutral-200)',
              boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)',
              padding: '56px 48px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: 68, height: 68, borderRadius: '50%',
                border: '2px solid var(--navy-700)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 28, color: 'var(--navy-700)',
              }}>
                <Check size={32} strokeWidth={2.5} />
              </div>
              <h1 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: 'var(--neutral-900)', lineHeight: 1.25 }}>
                {nome}, obrigada por dedicar seu tempo
              </h1>
              <p style={{ margin: '0 0 20px', fontSize: 15, color: 'var(--neutral-600)', lineHeight: 1.5 }}>
                Sua participação ajuda a compreender melhor o dia a dia de trabalho
              </p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--navy-700)' }}>
                Pesquisa concluída!
              </p>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: 580 }}>

            {/* Greeting */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--neutral-900)', margin: 0 }}>
                  Olá, {nome}!
                </h1>
                <DeadlinePill dias={diasRestantes} />
              </div>
              <Alert variant="info" noIcon>
                <ul style={{ margin: 0, paddingLeft: 18, listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <li>Como representante da CIPA, sua visão sobre o ambiente de trabalho é essencial para a saúde da equipe.</li>
                  <li>Reserve alguns minutos e responda os dois questionários abaixo antes do prazo.</li>
                </ul>
              </Alert>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <InfoBox
                variant={cipaVariant}
                title="Questionário exclusivo da CIPA"
                subtitle="Necessário para gerar o inventário"
                badge={statusLabel(cipaStatus)}
              >
                <p style={{ margin: '0 0 16px', fontSize: 13.5, color: 'var(--neutral-600)', lineHeight: 1.6 }}>
                  Aprofunda a avaliação das condições de trabalho sob a ótica da comissão de prevenção, com visão ampla da empresa.
                </p>
                <ProgressBar value={cipaRespondidas} total={TOTAL_CIPA} />
                {!cipaDone && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                    <Button size="sm" variant="primary" className="gap-1.5"
                      onClick={() => router.push(`/cipa/inicio?nome=${encodeURIComponent(nome)}`)}>
                      {buttonLabel(cipaStatus)}
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                )}
              </InfoBox>

              <InfoBox
                variant={mapVariant}
                title="Questionário geral da empresa"
                subtitle="Avaliação de fatores psicossociais do ambiente de trabalho"
                badge={statusLabel(mapStatus)}
              >
                <p style={{ margin: '0 0 16px', fontSize: 13.5, color: 'var(--neutral-600)', lineHeight: 1.6 }}>
                  Reúne a visão de todos os trabalhadores sobre como o trabalho é organizado e vivido no dia a dia.
                </p>
                <ProgressBar value={mapeamentoRespondidas} total={TOTAL_MAPEAMENTO} />
                {!mapeamentoDone && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                    <Button size="sm" variant="primary" className="gap-1.5"
                      onClick={() => router.push(`/questionario/inicio?nome=${encodeURIComponent(nome)}`)}>
                      {buttonLabel(mapStatus)}
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                )}
              </InfoBox>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '28px 16px 32px', flexShrink: 0 }}>
        <p style={{ fontSize: 14, color: 'var(--neutral-600)', margin: '0 0 6px', lineHeight: 1.6, maxWidth: 480, marginInline: 'auto' }}>
          Apoiamos empresas a entender e melhorar condições de trabalho a partir de pesquisas sobre o dia a dia na organização.
        </p>
        <p style={{ fontSize: 12, color: 'var(--emerald-600)', margin: 0 }}>
          © 2026 Fluir. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}

export default function CipaPage() {
  return (
    <Suspense>
      <CipaContent />
    </Suspense>
  );
}
