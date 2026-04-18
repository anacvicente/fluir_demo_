'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FluirLogo } from '@/components/fluir/logo';
import { Button } from '@/components/fluir/button';
import { Modal } from '@/components/fluir/modal';

// ─── Modal content ─────────────────────────────────────────────────────────────

function TermosDeUsoContent() {
  return (
    <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--neutral-700)' }}>
      <p><strong>1. Aceitação dos Termos</strong></p>
      <p>Ao participar desta pesquisa, você concorda com os presentes Termos de Uso. A participação é voluntária.</p>
      <p><strong>2. Finalidade</strong></p>
      <p>As informações coletadas têm como finalidade exclusiva subsidiar a elaboração do inventário de riscos psicossociais da organização, conforme exigido pela NR-01.</p>
      <p><strong>3. Confidencialidade</strong></p>
      <p>Suas respostas são processadas de forma agregada e confidencial. Em nenhuma hipótese respostas individuais serão identificadas ou compartilhadas de forma individualizada.</p>
      <p><strong>4. Voluntariedade</strong></p>
      <p>A participação é totalmente voluntária. Você pode interromper o preenchimento a qualquer momento sem qualquer consequência.</p>
      <p><strong>5. Responsável pelo Tratamento</strong></p>
      <p>Os dados são tratados pela Fluir.vc, conforme a Política de Privacidade disponível nesta plataforma.</p>
    </div>
  );
}

function PoliticaPrivacidadeContent() {
  return (
    <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--neutral-700)' }}>
      <p><strong>1. Dados Coletados</strong></p>
      <p>Para validação de identidade, coletamos CPF e data de nascimento. Durante a pesquisa, coletamos apenas suas respostas às perguntas apresentadas.</p>
      <p><strong>2. Uso dos Dados</strong></p>
      <p>Os dados são utilizados exclusivamente para geração do inventário de riscos psicossociais. Nenhum dado individual é compartilhado com a empresa contratante.</p>
      <p><strong>3. Armazenamento</strong></p>
      <p>As respostas são armazenadas com criptografia em servidores seguros. CPF e data de nascimento são utilizados apenas para autenticação e não são associados às respostas.</p>
      <p><strong>4. Compartilhamento</strong></p>
      <p>A Fluir.vc não vende, aluga ou compartilha dados pessoais com terceiros, exceto quando exigido por lei.</p>
      <p><strong>5. Seus Direitos (LGPD)</strong></p>
      <p>Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito de acessar, corrigir ou solicitar a exclusão dos seus dados. Entre em contato pelo e-mail privacidade@fluir.vc.</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CipaInicioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nome = searchParams.get('nome') || 'Representante';

  const [accepted, setAccepted] = useState(false);
  const [showTermos, setShowTermos] = useState(false);
  const [showPrivacidade, setShowPrivacidade] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--neutral-50, #f8f8f9)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 14 }}>
          <button
            onClick={() => router.push(`/cipa?nome=${encodeURIComponent(nome)}`)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-600)', fontWeight: 500, fontSize: 14, padding: 0, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}
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
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 700 }}>
          <div style={{
            background: 'white', borderRadius: 16,
            border: '1px solid var(--neutral-200)',
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)',
            padding: '40px 48px 36px',
          }}>

            <p style={{ margin: '0 0 24px', fontSize: 15, color: 'var(--neutral-700)', lineHeight: 1.5 }}>
              Como representante da CIPA, sua perspectiva é fundamental para a elaboração do inventário de riscos psicossociais da empresa.
            </p>

            <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: 'var(--neutral-900)' }}>
              Como funciona
            </h2>

            <ul style={{ margin: '0 0 28px', paddingLeft: 22, listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                <>Você responde com base no que <strong>a CIPA conhece sobre a organização</strong></>,
                <>As perguntas avaliam <strong>medidas e controles existentes</strong> na empresa</>,
                <>Suas respostas são tratadas de forma <strong>confidencial</strong></>,
                <>Sem este questionário, o <strong>inventário não pode ser gerado</strong></>,
              ].map((text, i) => (
                <li key={i} style={{ fontSize: 15, color: 'var(--neutral-700)', lineHeight: 1.5 }}>
                  {text}
                </li>
              ))}
            </ul>

            {/* Checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                style={{ marginTop: 2, width: 16, height: 16, accentColor: 'var(--navy-700)', cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ fontSize: 14, color: 'var(--neutral-700)', lineHeight: 1.5 }}>
                Concordo em participar, conforme os{' '}
                <button type="button" onClick={(e) => { e.preventDefault(); setShowTermos(true); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--navy-700)', fontWeight: 500, fontSize: 14, textDecoration: 'underline', fontFamily: 'inherit' }}>
                  Termos de Uso
                </button>
                {' '}e a{' '}
                <button type="button" onClick={(e) => { e.preventDefault(); setShowPrivacidade(true); }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--navy-700)', fontWeight: 500, fontSize: 14, textDecoration: 'underline', fontFamily: 'inherit' }}>
                  Política de Privacidade
                </button>
              </span>
            </label>

            <Button
              size="lg"
              className="w-full"
              disabled={!accepted}
              onClick={() => router.push(`/cipa/antes-de-comecar?nome=${encodeURIComponent(nome)}`)}
            >
              Continuar
            </Button>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '28px 16px 32px', flexShrink: 0 }}>
        <p style={{ fontSize: 14, color: 'var(--neutral-600)', margin: '0 0 6px', lineHeight: 1.6, maxWidth: 480, marginInline: 'auto' }}>
          Apoiamos empresas a entender e melhorar condições de trabalho a partir de pesquisas sobre o dia a dia na organização.
        </p>
        <p style={{ fontSize: 12, color: '#42b6a4', margin: 0 }}>
          © 2026 Fluir. Todos os direitos reservados.
        </p>
      </footer>

      <Modal isOpen={showTermos} onClose={() => setShowTermos(false)} title="Termos de Uso" size="lg"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="primary" onClick={() => setShowTermos(false)}>Fechar</Button></div>}>
        <TermosDeUsoContent />
      </Modal>

      <Modal isOpen={showPrivacidade} onClose={() => setShowPrivacidade(false)} title="Política de Privacidade" size="lg"
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="primary" onClick={() => setShowPrivacidade(false)}>Fechar</Button></div>}>
        <PoliticaPrivacidadeContent />
      </Modal>

    </div>
  );
}

export default function CipaInicioPage() {
  return <Suspense><CipaInicioContent /></Suspense>;
}
