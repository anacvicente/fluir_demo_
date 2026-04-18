'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FluirLogo } from '@/components/fluir/logo';
import { Button } from '@/components/fluir/button';
import { Modal } from '@/components/fluir/modal';

const COMO_FUNCIONA_ITEMS = [
  <>Você <strong>não está sendo avaliado</strong> nem em desempenho nem individualmente</>,
  <>As perguntas pedem a sua percepção <strong>sobre o ambiente de trabalho</strong></>,
  <>As respostas são analisadas de forma <strong>anônima</strong> e sempre em conjunto</>,
  <>A empresa <strong>não tem acesso</strong> às respostas individuais</>,
];

function AntesDeComecarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nome = searchParams.get('nome') || 'Trabalhador';

  const [showComoFunciona, setShowComoFunciona] = useState(false);

  const headerStyle: React.CSSProperties = {
    background: 'white',
    borderBottom: '1px solid var(--neutral-200)',
    padding: '0 32px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--neutral-50, #f8f8f9)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
    }}>

      {/* Header */}
      <header style={headerStyle}>
        <FluirLogo variant="color" height={28} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
          <span style={{ color: 'var(--neutral-700)', fontWeight: 500 }}>Olá, {nome}</span>
          <span style={{ color: 'var(--neutral-300)' }}>|</span>
          <button
            onClick={() => router.push('/questionario')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--neutral-600)',
              fontWeight: 500,
              fontSize: 14,
              padding: 0,
              fontFamily: 'inherit',
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 700 }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid var(--neutral-200)',
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)',
            padding: '40px 48px 36px',
          }}>

            {/* Label */}
            <p style={{
              margin: '0 0 10px',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--navy-600, #6b5b8a)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Questionário
            </p>

            {/* Title */}
            <h1 style={{
              margin: '0 0 28px',
              fontSize: 30,
              fontWeight: 700,
              color: 'var(--neutral-900)',
              lineHeight: 1.2,
            }}>
              Antes de começar
            </h1>

            {/* Bullets */}
            <ul style={{
              margin: '0 0 36px',
              paddingLeft: 22,
              listStyleType: 'disc',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              {[
                'Responda considerando seu trabalho nos últimos meses',
                'Marque a alternativa que melhor representa sua percepção',
                'Não existem respostas certas ou erradas',
                'Leva em média 15 a 20 minutos',
                'Você pode parar e continuar depois',
              ].map((text) => (
                <li key={text} style={{
                  fontSize: 15,
                  color: 'var(--neutral-700)',
                  lineHeight: 1.5,
                  display: 'list-item',
                }}>
                  {text}
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}>
              <button
                onClick={() => setShowComoFunciona(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--navy-700)',
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: 'underline',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                Como funciona
              </button>
              <Button
                size="lg"
                style={{ flex: 1 }}
                onClick={() => router.push(`/questionario/perguntas?nome=${encodeURIComponent(nome)}`)}
              >
                Começar
              </Button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px 16px 28px',
        flexShrink: 0,
        borderTop: '1px solid var(--neutral-200)',
      }}>
        <p style={{ fontSize: 13, color: 'var(--neutral-500)', margin: 0 }}>
          Suas respostas são confidenciais e serão utilizadas apenas para fins de pesquisa organizacional
        </p>
      </footer>

      {/* Modal — Como funciona */}
      <Modal
        isOpen={showComoFunciona}
        onClose={() => setShowComoFunciona(false)}
        title="Como funciona"
        size="md"
        footer={
          <Button
            size="lg"
            className="w-full"
            onClick={() => setShowComoFunciona(false)}
          >
            Fechar
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ margin: '0 0 16px', fontSize: 15, color: 'var(--neutral-700)' }}>
            Sua empresa está conduzindo uma pesquisa sobre o dia a dia de trabalho
          </p>
          <ul style={{ margin: 0, paddingLeft: 22, listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {COMO_FUNCIONA_ITEMS.map((item, i) => (
              <li key={i} style={{ fontSize: 15, color: 'var(--neutral-700)', lineHeight: 1.5, display: 'list-item' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Modal>

    </div>
  );
}

export default function AntesDeComecarPage() {
  return (
    <Suspense>
      <AntesDeComecarContent />
    </Suspense>
  );
}
