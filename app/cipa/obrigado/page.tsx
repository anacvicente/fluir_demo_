'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { FluirLogo } from '@/components/fluir/logo';
import { Button } from '@/components/fluir/button';

function ObrigadoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nome = searchParams.get('nome') || 'Representante';

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--neutral-50, #f8f8f9)',
      display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)',
    }}>
      <header style={{
        background: 'white', borderBottom: '1px solid var(--neutral-200)',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', flexShrink: 0,
      }}>
        <FluirLogo variant="color" height={28} />
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle2 size={32} color="#065f46" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--neutral-900)', margin: '0 0 12px' }}>
            Obrigado, {nome}!
          </h1>
          <p style={{ fontSize: 15, color: 'var(--neutral-600)', lineHeight: 1.6, margin: '0 0 32px' }}>
            Suas respostas do questionário complementar da CIPA foram registradas com sucesso. Elas serão utilizadas para gerar o inventário de riscos psicossociais.
          </p>
          <Button
            size="lg"
            onClick={() => router.push(`/cipa?nome=${encodeURIComponent(nome)}`)}
          >
            Voltar à página inicial
          </Button>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '28px 16px 32px', flexShrink: 0 }}>
        <p style={{ fontSize: 12, color: '#42b6a4', margin: 0 }}>
          © 2026 Fluir. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default function CipaObrigadoPage() {
  return <Suspense><ObrigadoContent /></Suspense>;
}
