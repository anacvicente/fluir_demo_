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
      <p>Ao participar desta pesquisa, você concorda com os presentes Termos de Uso. A participação é voluntária e anônima.</p>
      <p><strong>2. Finalidade</strong></p>
      <p>As informações coletadas têm como finalidade exclusiva subsidiar análises organizacionais internas, com o objetivo de melhorar as condições de trabalho na empresa.</p>
      <p><strong>3. Anonimato</strong></p>
      <p>Suas respostas são processadas de forma agregada. Em nenhuma hipótese suas respostas individuais serão identificadas ou compartilhadas com gestores, líderes ou qualquer pessoa da organização de forma individualizada.</p>
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
      <p>Os dados são utilizados exclusivamente para geração de relatórios agregados sobre o ambiente de trabalho. Nenhum dado individual é compartilhado com a empresa contratante.</p>
      <p><strong>3. Armazenamento</strong></p>
      <p>As respostas são armazenadas com criptografia em servidores seguros. CPF e data de nascimento são utilizados apenas para autenticação e não são associados às respostas.</p>
      <p><strong>4. Compartilhamento</strong></p>
      <p>A Fluir.vc não vende, aluga ou compartilha dados pessoais com terceiros, exceto quando exigido por lei.</p>
      <p><strong>5. Seus Direitos (LGPD)</strong></p>
      <p>Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito de acessar, corrigir ou solicitar a exclusão dos seus dados. Entre em contato pelo e-mail privacidade@fluir.vc.</p>
    </div>
  );
}

// ─── Page content ──────────────────────────────────────────────────────────────

function InicioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nome = searchParams.get('nome') || 'Trabalhador';

  const [accepted, setAccepted] = useState(false);
  const [showTermos, setShowTermos] = useState(false);
  const [showPrivacidade, setShowPrivacidade] = useState(false);

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
        <div style={{ width: '100%', maxWidth: 700 }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            border: '1px solid var(--neutral-200)',
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)',
            padding: '40px 48px 36px',
          }}>

            {/* Intro */}
            <p style={{
              margin: '0 0 24px',
              fontSize: 15,
              color: 'var(--neutral-700)',
              lineHeight: 1.5,
            }}>
              Sua empresa está conduzindo uma pesquisa sobre o dia a dia de trabalho
            </p>

            {/* Como funciona */}
            <h2 style={{
              margin: '0 0 16px',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--neutral-900)',
            }}>
              Como funciona
            </h2>

            <ul style={{
              margin: '0 0 28px',
              paddingLeft: 22,
              listStyleType: 'disc',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              {[
                <>Você <strong>não está sendo avaliado</strong> nem em desempenho nem individualmente</>,
                <>As perguntas pedem a sua percepção <strong>sobre o ambiente de trabalho</strong></>,
                <>As respostas são analisadas de forma <strong>anônima</strong> e sempre em conjunto</>,
                <>A empresa <strong>não tem acesso</strong> às respostas individuais</>,
              ].map((text, i) => (
                <li key={i} style={{
                  fontSize: 15,
                  color: 'var(--neutral-700)',
                  lineHeight: 1.5,
                  display: 'list-item',
                }}>
                  {text}
                </li>
              ))}
            </ul>

            {/* Checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              marginBottom: 20,
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                style={{
                  marginTop: 2,
                  width: 16,
                  height: 16,
                  accentColor: 'var(--navy-700)',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 14, color: 'var(--neutral-700)', lineHeight: 1.5 }}>
                Concordo em participar, conforme os{' '}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowTermos(true); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'var(--navy-700)',
                    fontWeight: 500,
                    fontSize: 14,
                    textDecoration: 'underline',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Termos de Uso
                </button>
                {' '}e a{' '}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowPrivacidade(true); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: 'var(--navy-700)',
                    fontWeight: 500,
                    fontSize: 14,
                    textDecoration: 'underline',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Política de Privacidade
                </button>
              </span>
            </label>

            {/* CTA */}
            <Button
              size="lg"
              className="w-full"
              disabled={!accepted}
              onClick={() => router.push(`/questionario/antes-de-comecar?nome=${encodeURIComponent(nome)}`)}
            >
              Continuar
            </Button>

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

      {/* Modal — Termos de Uso */}
      <Modal
        isOpen={showTermos}
        onClose={() => setShowTermos(false)}
        title="Termos de Uso"
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={() => setShowTermos(false)}>Fechar</Button>
          </div>
        }
      >
        <TermosDeUsoContent />
      </Modal>

      {/* Modal — Política de Privacidade */}
      <Modal
        isOpen={showPrivacidade}
        onClose={() => setShowPrivacidade(false)}
        title="Política de Privacidade"
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={() => setShowPrivacidade(false)}>Fechar</Button>
          </div>
        }
      >
        <PoliticaPrivacidadeContent />
      </Modal>

    </div>
  );
}

export default function QuestionarioInicioPage() {
  return (
    <Suspense>
      <InicioContent />
    </Suspense>
  );
}
