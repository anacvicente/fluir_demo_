'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Lock, FlaskConical } from 'lucide-react';
import { FluirLogo } from '@/components/fluir/logo';
import { Input } from '@/components/fluir/input';
import { Button } from '@/components/fluir/button';

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export default function QuestionarioPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [showProtoNav, setShowProtoNav] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isValid = email.length > 0 || cpf.length > 0 || dataNascimento.length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProtoNav(false);
      }
    }
    if (showProtoNav) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProtoNav]);

  function handleContinuar() {
    setShowProtoNav(true);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--neutral-50, #f8f8f9)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
    }}>

      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid var(--neutral-200)',
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <FluirLogo variant="color" height={28} />
        <span style={{
          fontSize: 14,
          color: 'var(--neutral-600)',
          fontWeight: 500,
        }}>
          Pesquisa organizacional
        </span>
      </header>

      {/* Main */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
      }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid var(--neutral-200)',
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)',
            padding: '40px 40px 36px',
          }}>

            {/* Invite title */}
            <h1 style={{
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--neutral-900)',
              lineHeight: 1.25,
              margin: '0 0 24px',
            }}>
              Saab convidou você a responder algumas perguntas sobre o dia a dia de trabalho
            </h1>

            {/* Info box */}
            <div style={{
              background: '#edf9f6',
              borderRadius: 10,
              padding: '16px 18px',
              marginBottom: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <TrendingUp size={18} color="#42b6a4" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ margin: 0, fontSize: 13.5, color: 'var(--neutral-700)', lineHeight: 1.5 }}>
                  As respostas ajudam a identificar pontos de atenção e{' '}
                  <strong style={{ color: 'var(--neutral-900)' }}>apoiar melhorias no ambiente de trabalho</strong>
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Lock size={18} color="#42b6a4" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ margin: 0, fontSize: 13.5, color: 'var(--neutral-700)', lineHeight: 1.5 }}>
                  Suas respostas são analisadas{' '}
                  <strong style={{ color: 'var(--neutral-900)' }}>sem identificação individual</strong>
                </p>
              </div>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input
                label="E-mail"
                type="email"
                placeholder="usuario@empresa.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="CPF"
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
              />
              <Input
                label="Data de nascimento"
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />

              <div ref={dropdownRef} style={{ position: 'relative', marginTop: 4 }}>
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!isValid}
                  onClick={handleContinuar}
                >
                  Continuar
                </Button>

                {showProtoNav && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: '#2a2a2a',
                    border: '1px solid #555',
                    borderRadius: 8,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                    zIndex: 50,
                    fontFamily: 'monospace',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 12px',
                      background: '#1a1a1a',
                      borderBottom: '1px solid #444',
                    }}>
                      <FlaskConical size={12} color="#aaa" />
                      <span style={{ fontSize: 11, color: '#aaa', letterSpacing: '0.04em' }}>
                        NAVEGAÇÃO DE PROTÓTIPO
                      </span>
                    </div>
                    <button
                      onClick={() => router.push('/cipa?nome=Ana')}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '11px 14px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #3a3a3a',
                        color: '#e0e0e0',
                        fontSize: 13,
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'monospace',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#383838')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      → CIPA + Questionário
                    </button>
                    <button
                      onClick={() => router.push('/questionario/inicio?nome=Ana')}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '11px 14px',
                        background: 'transparent',
                        border: 'none',
                        color: '#e0e0e0',
                        fontSize: 13,
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'monospace',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#383838')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      → Questionário
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '28px 16px 32px',
        flexShrink: 0,
      }}>
        <p style={{
          fontSize: 14,
          color: 'var(--neutral-600)',
          margin: '0 0 6px',
          lineHeight: 1.6,
          maxWidth: 480,
          marginInline: 'auto',
        }}>
          Apoiamos empresas a entender e melhorar condições de trabalho a partir de pesquisas sobre o dia a dia na organização.
        </p>
        <p style={{ fontSize: 12, color: '#42b6a4', margin: 0 }}>
          © 2026 Fluir. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}
