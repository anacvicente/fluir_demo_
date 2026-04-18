'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { FluirLogo } from '@/components/fluir/logo';

function ObrigadoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nome = searchParams.get('nome') || 'Trabalhador';

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

            {/* Check icon */}
            <div style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              border: '2px solid var(--navy-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 28,
              color: 'var(--navy-700)',
            }}>
              <Check size={32} strokeWidth={2.5} />
            </div>

            {/* Title */}
            <h1 style={{
              margin: '0 0 12px',
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--neutral-900)',
              lineHeight: 1.25,
            }}>
              {nome}, obrigada por dedicar seu tempo
            </h1>

            {/* Subtitle */}
            <p style={{
              margin: '0 0 20px',
              fontSize: 15,
              color: 'var(--neutral-600)',
              lineHeight: 1.5,
            }}>
              Sua participação ajuda a compreender melhor o dia a dia de trabalho
            </p>

            {/* Badge */}
            <p style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--navy-700)',
            }}>
              Pesquisa concluída!
            </p>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '28px 16px 32px',
        flexShrink: 0,
        borderTop: '1px solid var(--neutral-200)',
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

export default function ObrigadoPage() {
  return (
    <Suspense>
      <ObrigadoContent />
    </Suspense>
  );
}
