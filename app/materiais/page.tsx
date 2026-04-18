'use client';

import { useState } from 'react';
import {
  Menu, Copy, Check, ChevronDown, ChevronUp,
  MessageCircle, Mail, Monitor, Send, BookOpen, User,
} from 'lucide-react';
import { AppSidebar } from '@/components/fluir/app-sidebar';
import { Button } from '@/components/fluir/button';
import { Callout } from '@/components/fluir/callout';
import { Tabs, TabList, Tab, TabPanel } from '@/components/fluir/tabs';

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = 'whatsapp' | 'email' | 'intranet' | 'mensagem' | 'apoio';

interface Material {
  id: string;
  title: string;
  audience: string;
  text: string;
}

interface ChannelGroup {
  channel: Channel;
  materials: Material[];
}

interface TabData {
  id: string;
  label: string;
  hint: string;
  groups: ChannelGroup[];
}

// ─── Channel config ───────────────────────────────────────────────────────────

const CHANNEL_CONFIG: Record<Channel, {
  label: string;
  Icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}> = {
  whatsapp: {
    label: 'WhatsApp',
    Icon: MessageCircle,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
  },
  email: {
    label: 'E-mail',
    Icon: Mail,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  intranet: {
    label: 'Intranet e murais',
    Icon: Monitor,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
  },
  mensagem: {
    label: 'Mensagem direta',
    Icon: Send,
    iconColor: 'text-[var(--navy-700)]',
    iconBg: 'bg-[var(--navy-100)]',
  },
  apoio: {
    label: 'Material de apoio',
    Icon: BookOpen,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
  },
};

// ─── Content ──────────────────────────────────────────────────────────────────

const TABS: TabData[] = [
  {
    id: 'pre',
    label: 'Pré-campanha',
    hint: 'Enquanto organiza a base e prepara o lançamento, já é possível começar a comunicação interna. Envie às lideranças e aos canais antes de abrir a coleta — o engajamento começa antes do link chegar.',
    groups: [
      {
        channel: 'whatsapp',
        materials: [
          {
            id: 'pre-w1',
            title: 'Anúncio nos grupos internos',
            audience: 'Para toda a empresa',
            text: `Oi, pessoal! 👋

Em breve vamos lançar nossa pesquisa de saúde no trabalho. É rápida (uns 10 minutinhos), totalmente anônima e vai ajudar muito a melhorar o nosso ambiente.

Fique de olho no link que vai chegar em breve. Qualquer dúvida, me chame!`,
          },
        ],
      },
      {
        channel: 'email',
        materials: [
          {
            id: 'pre-e1',
            title: 'E-mail de anúncio institucional',
            audience: 'Para toda a empresa',
            text: `Assunto: Pesquisa de saúde no trabalho — sua participação é importante

Olá, equipe.

Em breve vamos lançar a nossa pesquisa de saúde psicossocial no trabalho. Ela é parte do nosso compromisso com um ambiente mais saudável e equilibrado para todos.

A participação é voluntária e as respostas são totalmente anônimas — nenhuma resposta é vinculada a uma pessoa específica.

Em breve você receberá o link de acesso. Quando ele chegar, separe uns 10 minutinhos e contribua com a sua percepção.

Sua voz faz diferença.`,
          },
        ],
      },
      {
        channel: 'intranet',
        materials: [
          {
            id: 'pre-i1',
            title: 'Aviso para mural ou intranet',
            audience: 'Para toda a empresa',
            text: `EM BREVE: Pesquisa de saúde no trabalho

Anônima, rápida (uns 10 min) e importante para todos nós.

Fique atento ao link que você vai receber em breve. Sua participação conta.`,
          },
        ],
      },
      {
        channel: 'mensagem',
        materials: [
          {
            id: 'pre-m1',
            title: 'Briefing para lideranças',
            audience: 'Para gestores e lideranças',
            text: `Olá, [nome].

Em breve vamos lançar uma pesquisa de saúde psicossocial para toda a equipe. Quero te informar com antecedência para que você possa preparar o seu time.

A pesquisa é confidencial, leva em média 10 minutos e vai nos ajudar a entender melhor o ambiente de trabalho. Sua participação como liderança é importante: engaje sua equipe e reforce que as respostas são anônimas.

Em breve você receberá mais detalhes. Qualquer dúvida, estou à disposição.`,
          },
          {
            id: 'pre-m2',
            title: 'Como engajar sua equipe',
            audience: 'Para gestores e lideranças',
            text: `Algumas formas de apoiar a participação da sua equipe:

• Mencione a pesquisa em reuniões de equipe ainda esta semana
• Reforce que as respostas são confidenciais e não identificam quem respondeu
• Disponibilize alguns minutos durante o expediente para o preenchimento
• Deixe claro que os resultados vão ser usados para melhorar o ambiente de trabalho

Sua postura como liderança faz diferença direta na taxa de adesão.`,
          },
          {
            id: 'pre-m3',
            title: 'Respostas para perguntas da equipe',
            audience: 'Para gestores e lideranças',
            text: `"A pesquisa é segura?"
Sim. As respostas são anônimas e nenhuma resposta individual é identificada.

"A empresa vai ver o que eu respondo?"
Não. Os resultados aparecem sempre consolidados por grupo, nunca por pessoa.

"Por que devo participar?"
Porque sua percepção importa. Quanto mais pessoas participam, mais fiel é o retrato da realidade — e mais efetivas serão as ações que vão resultar disso.

"Quanto tempo leva?"
Em média 10 minutos. Você pode preencher pelo celular ou computador.`,
          },
        ],
      },
    ],
  },

  {
    id: 'durante',
    label: 'Durante a coleta',
    hint: 'A pesquisa já está aberta. Use esses materiais para manter o engajamento ao longo da coleta e ajudar as lideranças a responder dúvidas que surgirem no caminho.',
    groups: [
      {
        channel: 'whatsapp',
        materials: [
          {
            id: 'dur-w1',
            title: 'Lembrete de participação',
            audience: 'Para toda a empresa',
            text: `Oi, pessoal! 👋

A pesquisa de saúde no trabalho está aberta! Se você ainda não respondeu, aproveite — leva menos de 10 minutinhos e é totalmente anônima.

Acesse aqui: [LINK]`,
          },
          {
            id: 'dur-w2',
            title: 'Lembrete de prazo',
            audience: 'Para toda a empresa',
            text: `Oi, pessoal! ⏰

A pesquisa de saúde no trabalho encerra em breve. Se você ainda não respondeu, essa é a hora!

É rápida, anônima e ajuda muito. Acesse aqui: [LINK]`,
          },
        ],
      },
      {
        channel: 'email',
        materials: [
          {
            id: 'dur-e1',
            title: 'Lembrete de participação',
            audience: 'Para toda a empresa',
            text: `Assunto: Lembrete: pesquisa de saúde no trabalho ainda aberta

Olá!

A nossa pesquisa de saúde no trabalho ainda está aberta. Se você ainda não respondeu, aproveite — leva menos de 10 minutos e sua contribuição é muito importante para o processo.

Acesse pelo link abaixo:
[LINK DA PESQUISA]

Em caso de dúvidas, fale comigo.`,
          },
        ],
      },
      {
        channel: 'mensagem',
        materials: [
          {
            id: 'dur-m1',
            title: 'Lembrete de engajamento',
            audience: 'Para gestores e lideranças',
            text: `Oi, [nome].

A pesquisa já está aberta! Aproveite a próxima reunião de equipe para lembrar o pessoal.

Reforce que é anônima e que leva menos de 10 minutos. Se possível, deixe um tempinho reservado durante o expediente para quem quiser preencher.

A participação da sua equipe faz diferença nos resultados.`,
          },
          {
            id: 'dur-m2',
            title: 'Como responder sobre confidencialidade',
            audience: 'Para gestores e lideranças',
            text: `Se alguém perguntar sobre confidencialidade, você pode responder assim:

"As respostas são completamente anônimas. A pesquisa não identifica quem respondeu o quê. Os resultados aparecem sempre consolidados por grupo, nunca individualmente. Pode participar com tranquilidade."

Se a pessoa insistir:
"Nem eu como gestor tenho acesso às respostas individuais. O sistema consolida os dados automaticamente antes de gerar qualquer relatório."`,
          },
        ],
      },
    ],
  },

  {
    id: 'pos',
    label: 'Pós-campanha',
    hint: 'A coleta foi encerrada. Agora é hora de comunicar os próximos passos com clareza — antes que as perguntas cheguem. Gerencie expectativas antes de qualquer divulgação de resultados.',
    groups: [
      {
        channel: 'whatsapp',
        materials: [
          {
            id: 'pos-w1',
            title: 'Agradecimento aos participantes',
            audience: 'Para gestores enviarem à equipe',
            text: `Pessoal, quero agradecer a todos que participaram da pesquisa de saúde no trabalho! 🙏

A adesão foi muito boa e isso vai fazer diferença nos resultados. Em breve compartilharemos os próximos passos.

Obrigado pela confiança e pela participação!`,
          },
        ],
      },
      {
        channel: 'email',
        materials: [
          {
            id: 'pos-e1',
            title: 'Comunicado de encerramento',
            audience: 'Para toda a empresa',
            text: `Assunto: Pesquisa encerrada — obrigado pela participação

Olá, equipe.

A nossa pesquisa de saúde no trabalho foi encerrada. Agradecemos a todos que participaram — a adesão foi fundamental para a qualidade dos resultados.

Os dados estão sendo analisados e em breve comunicaremos os próximos passos.`,
          },
        ],
      },
      {
        channel: 'mensagem',
        materials: [
          {
            id: 'pos-m1',
            title: 'Comunicando os próximos passos',
            audience: 'Para gestores e lideranças',
            text: `Oi, [nome].

A coleta da pesquisa foi encerrada. Antes de qualquer comunicação sobre resultados para a equipe, quero te dar contexto sobre os próximos passos.

Estamos analisando os dados e em breve vou te passar um retorno organizado. Por enquanto, se a equipe perguntar, você pode dizer que a coleta foi encerrada com boa participação e que os resultados serão compartilhados em breve.

Agradeça o pessoal pela participação.`,
          },
          {
            id: 'pos-m2',
            title: 'O que comunicar sobre os resultados',
            audience: 'Para gestores e lideranças',
            text: `Antes de comunicar os resultados, leve em consideração:

• Defina quem receberá os resultados e em qual formato (lideranças primeiro, depois equipe geral)
• Evite comparações diretas entre setores sem contexto adequado
• Apresente os resultados junto com as ações que serão tomadas a partir deles
• Seja claro sobre o que ainda não está definido — isso gera mais confiança do que prometer o que não é certo

Resultados apresentados com contexto e plano de ação geram muito mais engajamento do que números soltos.`,
          },
        ],
      },
    ],
  },

  {
    id: 'sempre',
    label: 'Sempre úteis',
    hint: 'Materiais de apoio que podem ser usados em qualquer momento da campanha — para contextualizar gestores, esclarecer dúvidas ou dar embasamento ao processo.',
    groups: [
      {
        channel: 'mensagem',
        materials: [
          {
            id: 'sem-m1',
            title: 'O que é saúde psicossocial no trabalho',
            audience: 'Para gestores e lideranças',
            text: `Saúde psicossocial no trabalho se refere ao impacto que as condições, organização e relações de trabalho têm sobre o bem-estar mental e emocional das pessoas.

Fatores como sobrecarga, falta de autonomia, conflito entre trabalho e vida pessoal, qualidade das relações com lideranças e clareza de papel são exemplos de aspectos psicossociais que influenciam diretamente a saúde e o desempenho das equipes.

Identificar esses fatores não é sinal de fraqueza organizacional — é o primeiro passo para agir com responsabilidade e com evidência.`,
          },
          {
            id: 'sem-m2',
            title: 'Por que pesquisas como essa importam',
            audience: 'Para gestores e lideranças',
            text: `Pesquisas de saúde psicossocial permitem identificar riscos antes que eles se tornem problemas visíveis.

Elas dão voz aos trabalhadores de forma segura, geram dados para decisões mais precisas e ajudam a empresa a cumprir obrigações legais, como as da NR-01.

Para lideranças, os resultados são uma oportunidade de entender o que a equipe realmente precisa — e de agir com base em evidências, não em suposições.

Uma pesquisa bem conduzida não expõe a gestão: ela ajuda a gestão a melhorar.`,
          },
        ],
      },
      {
        channel: 'apoio',
        materials: [
          {
            id: 'sem-a1',
            title: 'Carta de confidencialidade',
            audience: 'Para toda a empresa',
            text: `As respostas coletadas nesta pesquisa são tratadas com total confidencialidade.

Nenhuma resposta individual é identificada, acessada ou vinculada a um respondente específico. Os resultados são consolidados por grupo ou setor e utilizados exclusivamente para fins de diagnóstico e melhoria do ambiente organizacional.

O tratamento dos dados segue as diretrizes da LGPD e está alinhado às exigências da NR-01. Nenhum gestor ou pessoa da empresa tem acesso às respostas individuais.`,
          },
          {
            id: 'sem-a2',
            title: 'O que é NR-01 — explicação acessível',
            audience: 'Para toda a empresa',
            text: `A NR-01 é uma norma federal brasileira que passou a exigir, a partir de 2025, que empresas identifiquem e gerenciem riscos psicossociais no trabalho.

Isso significa que as organizações precisam avaliar fatores como sobrecarga, qualidade das relações e organização do trabalho — e tomar medidas concretas para proteger a saúde mental dos trabalhadores.

A nossa pesquisa é parte desse processo: ela é o instrumento que usamos para coletar os dados que alimentam essa avaliação de forma estruturada e rastreável.`,
          },
        ],
      },
    ],
  },
];

// ─── MaterialCard ─────────────────────────────────────────────────────────────

function MaterialCard({ material }: { material: Material }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(material.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PREVIEW_LEN = 200;
  const needsTruncation = material.text.length > PREVIEW_LEN;
  const displayText = expanded || !needsTruncation
    ? material.text
    : material.text.slice(0, PREVIEW_LEN).trimEnd() + '…';

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5 flex flex-col gap-3 shadow-[var(--shadow-sm)]">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">{material.title}</p>
        <span className="inline-flex items-center gap-1.5 w-fit text-[11px] font-medium text-[var(--text-secondary)] bg-[var(--surface-muted)] px-2 py-0.5 rounded-full">
          <User className="w-3 h-3 shrink-0" />
          {material.audience}
        </span>
      </div>

      <div className="bg-[var(--surface-subtle)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
        {displayText}
      </div>

      <div className="flex items-center gap-2 pt-0.5">
        <Button
          size="sm"
          variant={copied ? 'secondary' : 'primary'}
          onClick={handleCopy}
          className="gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copiado!' : 'Copiar texto'}
        </Button>

        {needsTruncation && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded(e => !e)}
            className="gap-1"
          >
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" />Fechar</>
              : <><ChevronDown className="w-3.5 h-3.5" />Ver completo</>}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── ChannelSection ───────────────────────────────────────────────────────────

function ChannelSection({ group }: { group: ChannelGroup }) {
  const cfg = CHANNEL_CONFIG[group.channel];
  const Icon = cfg.Icon;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
          <Icon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
        </div>
        <span className="text-sm font-semibold text-[var(--text-primary)]">{cfg.label}</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {group.materials.map(m => (
          <MaterialCard key={m.id} material={m} />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MateriaisPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex overflow-hidden md:h-screen bg-[var(--surface-subtle)]">
      <AppSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 md:overflow-y-auto">
        <header className="h-14 bg-white border-b border-[var(--border)] flex items-center gap-3 px-4 md:px-8 sticky top-0 z-20">
          <button className="p-2 -ml-2 md:hidden" onClick={() => setMobileSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
          <h1 className="text-sm font-semibold text-[var(--text-primary)]">Materiais</h1>
        </header>

        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Materiais de comunicação</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Textos prontos para comunicar a campanha nos canais internos e engajar as lideranças — organizados pelo momento da campanha.
            </p>
          </div>

          <Tabs defaultTab="pre">
            <TabList>
              {TABS.map(t => (
                <Tab key={t.id} tabId={t.id}>{t.label}</Tab>
              ))}
            </TabList>

            {TABS.map(tab => (
              <TabPanel key={tab.id} tabId={tab.id}>
                <Callout variant="tip" title="Quando usar" className="mb-6">
                  {tab.hint}
                </Callout>

                <div className="flex flex-col gap-8">
                  {tab.groups.map(group => (
                    <ChannelSection key={group.channel} group={group} />
                  ))}
                </div>
              </TabPanel>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
