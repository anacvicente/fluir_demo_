'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, FileDown, ClipboardList, CheckCircle2, Circle, Settings2, ArrowRight } from 'lucide-react';
import { AppSidebar } from '@/components/fluir/app-sidebar';
import { Button } from '@/components/fluir/button';
import { FluirLogo } from '@/components/fluir/logo';

// ─── Types ────────────────────────────────────────────────────────────────────

type Nivel = 'Baixo' | 'Moderado' | 'Alto' | 'Crítico';

interface GrupoRisco {
  setor: string;
  trabalhadores: number;
  probabilidade: number;
  severidade: number;
  ps: number;
  classificacao: Nivel;
}

interface RPSInventario {
  id: string;
  nome: string;
  agravos: string;
  riscoAssociado: string;
  grupos: GrupoRisco[];
}

interface Acao {
  acao: string;
  nivel: string;
  responsavel: string;
  prazo: number;
}

interface GrupoAcao {
  setor: string;
  criticidade: Nivel;
  acoes: Acao[];
}

interface RPSAcao {
  id: string;
  nome: string;
  agravos: string;
  riscoAssociado: string;
  indicador: string;
  grupos: GrupoAcao[];
}

// ─── Dados da Empresa ─────────────────────────────────────────────────────────

const EMPRESA = {
  razaoSocial: 'Empresa Exemplo LTDA',
  cnpj: '00.000.000/0001-00',
  atividade: 'Desenvolvimento de software e serviços corporativos',
  trabalhadores: 89,
  responsavel: 'RH',
  periodo: 'Janeiro/2026',
  criterioSemelhanca: 'Setor/área de atuação',
  coleta: { inicio: '03/03/2026', fim: '18/03/2026', elegiveis: 89, respondentes: 74, taxa: '83%' },
};

// ─── Inventário ───────────────────────────────────────────────────────────────

const INVENTARIO: RPSInventario[] = [
  {
    id: 'RPS-01', nome: 'Sobrecarga quantitativa',
    agravos: 'Fadiga; Exaustão; Burnout',
    riscoAssociado: 'Estresse ocupacional crônico',
    grupos: [
      { setor: 'Operações',            trabalhadores: 24, probabilidade: 4, severidade: 2, ps: 8,  classificacao: 'Moderado' },
      { setor: 'Atendimento ao Cliente', trabalhadores: 20, probabilidade: 4, severidade: 2, ps: 8,  classificacao: 'Moderado' },
      { setor: 'Tecnologia',           trabalhadores: 18, probabilidade: 1, severidade: 2, ps: 2,  classificacao: 'Baixo'    },
      { setor: 'Comercial',            trabalhadores: 15, probabilidade: 2, severidade: 2, ps: 4,  classificacao: 'Baixo'    },
      { setor: 'Logística',            trabalhadores: 12, probabilidade: 4, severidade: 2, ps: 8,  classificacao: 'Moderado' },
    ],
  },
  {
    id: 'RPS-02', nome: 'Ritmo excessivo de trabalho',
    agravos: 'Fadiga; Irritabilidade; Exaustão psicofisiológica',
    riscoAssociado: 'Síndrome do Burnout ocupacional',
    grupos: [
      { setor: 'Operações',            trabalhadores: 24, probabilidade: 3, severidade: 2, ps: 6,  classificacao: 'Moderado' },
      { setor: 'Atendimento ao Cliente', trabalhadores: 20, probabilidade: 3, severidade: 2, ps: 6,  classificacao: 'Moderado' },
      { setor: 'Tecnologia',           trabalhadores: 18, probabilidade: 1, severidade: 2, ps: 2,  classificacao: 'Baixo'    },
      { setor: 'Comercial',            trabalhadores: 15, probabilidade: 2, severidade: 2, ps: 4,  classificacao: 'Baixo'    },
      { setor: 'Logística',            trabalhadores: 12, probabilidade: 4, severidade: 2, ps: 8,  classificacao: 'Baixo'    },
    ],
  },
  {
    id: 'RPS-03', nome: 'Exigência cognitiva elevada',
    agravos: 'Fadiga mental; Queda de atenção; Sobrecarga mental',
    riscoAssociado: 'Transtornos neurocognitivos relacionados ao trabalho',
    grupos: [
      { setor: 'Operações',            trabalhadores: 24, probabilidade: 2, severidade: 2, ps: 4,  classificacao: 'Baixo'    },
      { setor: 'Atendimento ao Cliente', trabalhadores: 20, probabilidade: 2, severidade: 2, ps: 4,  classificacao: 'Baixo'    },
      { setor: 'Tecnologia',           trabalhadores: 18, probabilidade: 3, severidade: 2, ps: 6,  classificacao: 'Moderado' },
      { setor: 'Comercial',            trabalhadores: 15, probabilidade: 2, severidade: 2, ps: 4,  classificacao: 'Baixo'    },
      { setor: 'Logística',            trabalhadores: 12, probabilidade: 2, severidade: 2, ps: 4,  classificacao: 'Baixo'    },
    ],
  },
  {
    id: 'RPS-04', nome: 'Exigência emocional elevada',
    agravos: 'Desgaste emocional; Burnout',
    riscoAssociado: 'Esgotamento emocional',
    grupos: [
      { setor: 'Operações',            trabalhadores: 24, probabilidade: 2, severidade: 2, ps: 4,  classificacao: 'Baixo'    },
      { setor: 'Atendimento ao Cliente', trabalhadores: 20, probabilidade: 4, severidade: 2, ps: 8,  classificacao: 'Moderado' },
      { setor: 'Tecnologia',           trabalhadores: 18, probabilidade: 1, severidade: 2, ps: 2,  classificacao: 'Baixo'    },
      { setor: 'Comercial',            trabalhadores: 15, probabilidade: 3, severidade: 2, ps: 6,  classificacao: 'Moderado' },
      { setor: 'Logística',            trabalhadores: 12, probabilidade: 2, severidade: 2, ps: 4,  classificacao: 'Baixo'    },
    ],
  },
  {
    id: 'RPS-05', nome: 'Baixa autonomia',
    agravos: 'Desmotivação; Estresse',
    riscoAssociado: 'Sofrimento psicossocial',
    grupos: [
      { setor: 'Operações',            trabalhadores: 24, probabilidade: 3, severidade: 2, ps: 6,  classificacao: 'Moderado' },
      { setor: 'Atendimento ao Cliente', trabalhadores: 20, probabilidade: 3, severidade: 2, ps: 6,  classificacao: 'Moderado' },
      { setor: 'Tecnologia',           trabalhadores: 18, probabilidade: 1, severidade: 2, ps: 2,  classificacao: 'Baixo'    },
      { setor: 'Comercial',            trabalhadores: 15, probabilidade: 2, severidade: 2, ps: 4,  classificacao: 'Baixo'    },
      { setor: 'Logística',            trabalhadores: 12, probabilidade: 3, severidade: 2, ps: 6,  classificacao: 'Moderado' },
    ],
  },
  {
    id: 'RPS-20', nome: 'Conflito trabalho-vida pessoal',
    agravos: 'Fadiga; Exaustão',
    riscoAssociado: 'Sobrecarga psicossocial',
    grupos: [
      { setor: 'Operações',            trabalhadores: 24, probabilidade: 4, severidade: 4, ps: 16, classificacao: 'Crítico'  },
      { setor: 'Atendimento ao Cliente', trabalhadores: 20, probabilidade: 4, severidade: 4, ps: 16, classificacao: 'Crítico'  },
      { setor: 'Tecnologia',           trabalhadores: 18, probabilidade: 2, severidade: 4, ps: 8,  classificacao: 'Moderado' },
      { setor: 'Comercial',            trabalhadores: 15, probabilidade: 2, severidade: 4, ps: 8,  classificacao: 'Moderado' },
      { setor: 'Logística',            trabalhadores: 12, probabilidade: 3, severidade: 4, ps: 12, classificacao: 'Alto'     },
    ],
  },
];

// ─── Plano de Ação ────────────────────────────────────────────────────────────

const PLANO: RPSAcao[] = [
  {
    id: 'RPS-01', nome: 'Sobrecarga quantitativa',
    agravos: 'Fadiga; Exaustão; Burnout',
    riscoAssociado: 'Estresse ocupacional crônico',
    indicador: 'Índice de Sobrecarga de Trabalho',
    grupos: [
      { setor: 'Operações', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir ritmo imposto por planejamento participativo', nivel: 'Substituição',   responsavel: 'Gerente de Operações', prazo: 180 },
        { acao: 'Dimensionamento adequado de equipe',                     nivel: 'Organizacional', responsavel: 'Gerente de RH',        prazo: 180 },
        { acao: 'Capacitação em gestão do tempo',                         nivel: 'Individual',     responsavel: 'Gerente de RH',        prazo: 180 },
      ]},
      { setor: 'Atendimento ao Cliente', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir ritmo imposto por planejamento participativo', nivel: 'Substituição',   responsavel: 'Gerente de Atendimento', prazo: 180 },
        { acao: 'Dimensionamento adequado de equipe',                     nivel: 'Organizacional', responsavel: 'Gerente de RH',          prazo: 180 },
        { acao: 'Capacitação em gestão do tempo',                         nivel: 'Individual',     responsavel: 'Gerente de RH',          prazo: 180 },
      ]},
      { setor: 'Logística', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir ritmo imposto por planejamento participativo', nivel: 'Substituição',   responsavel: 'Gerente de Logística', prazo: 180 },
        { acao: 'Dimensionamento adequado de equipe',                     nivel: 'Organizacional', responsavel: 'Gerente de RH',        prazo: 180 },
        { acao: 'Capacitação em gestão do tempo',                         nivel: 'Individual',     responsavel: 'Gerente de RH',        prazo: 180 },
      ]},
    ],
  },
  {
    id: 'RPS-02', nome: 'Ritmo excessivo de trabalho',
    agravos: 'Fadiga; Irritabilidade; Exaustão psicofisiológica',
    riscoAssociado: 'Síndrome do Burnout ocupacional',
    indicador: 'Ritmo de Trabalho',
    grupos: [
      { setor: 'Operações', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir modelo de urgência permanente por planejamento estruturado', nivel: 'Substituição',   responsavel: 'Diretor Executivo',  prazo: 180 },
        { acao: 'Inserção formal de pausas',                                            nivel: 'Organizacional', responsavel: 'Gestor do Setor',    prazo: 180 },
        { acao: 'Avaliação médica ocupacional',                                         nivel: 'Individual',     responsavel: 'Médico do Trabalho', prazo: 180 },
      ]},
      { setor: 'Atendimento ao Cliente', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir modelo de urgência permanente por planejamento estruturado', nivel: 'Substituição',   responsavel: 'Diretor Executivo',  prazo: 180 },
        { acao: 'Inserção formal de pausas',                                            nivel: 'Organizacional', responsavel: 'Gestor do Setor',    prazo: 180 },
        { acao: 'Avaliação médica ocupacional',                                         nivel: 'Individual',     responsavel: 'Médico do Trabalho', prazo: 180 },
      ]},
      { setor: 'Logística', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir modelo de urgência permanente por planejamento estruturado', nivel: 'Substituição',   responsavel: 'Diretor Executivo',  prazo: 180 },
        { acao: 'Inserção formal de pausas',                                            nivel: 'Organizacional', responsavel: 'Gestor do Setor',    prazo: 180 },
        { acao: 'Avaliação médica ocupacional',                                         nivel: 'Individual',     responsavel: 'Médico do Trabalho', prazo: 180 },
      ]},
    ],
  },
  {
    id: 'RPS-03', nome: 'Exigências cognitivas',
    agravos: 'Fadiga mental; Déficit de atenção; Erros operacionais',
    riscoAssociado: 'Sobrecarga cognitiva',
    indicador: 'Exigências Cognitivas',
    grupos: [
      { setor: 'Operações', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir processos complexos por fluxos padronizados', nivel: 'Substituição',   responsavel: 'Diretor de Operações', prazo: 180 },
        { acao: 'Implantação de checklists operacionais',                 nivel: 'Organizacional', responsavel: 'Diretor de Operações', prazo: 180 },
        { acao: 'Ajuste temporário de demanda',                          nivel: 'Individual',     responsavel: 'Gestor do Setor',     prazo: 180 },
      ]},
      { setor: 'Atendimento ao Cliente', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir processos complexos por fluxos padronizados', nivel: 'Substituição',   responsavel: 'Diretor de Operações', prazo: 180 },
        { acao: 'Implantação de checklists operacionais',                 nivel: 'Organizacional', responsavel: 'Diretor de Operações', prazo: 180 },
        { acao: 'Ajuste temporário de demanda',                          nivel: 'Individual',     responsavel: 'Gestor do Setor',     prazo: 180 },
      ]},
      { setor: 'Logística', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir processos complexos por fluxos padronizados', nivel: 'Substituição',   responsavel: 'Diretor de Operações', prazo: 180 },
        { acao: 'Implantação de checklists operacionais',                 nivel: 'Organizacional', responsavel: 'Diretor de Operações', prazo: 180 },
        { acao: 'Ajuste temporário de demanda',                          nivel: 'Individual',     responsavel: 'Gestor do Setor',     prazo: 180 },
      ]},
    ],
  },
  {
    id: 'RPS-04', nome: 'Exigência emocional elevada',
    agravos: 'Desgaste emocional; Burnout',
    riscoAssociado: 'Esgotamento emocional',
    indicador: 'Exigências Emocionais',
    grupos: [
      { setor: 'Atendimento ao Cliente', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir atendimento crítico contínuo por revezamento estruturado', nivel: 'Substituição',   responsavel: 'Diretor de Operações', prazo: 180 },
        { acao: 'Rodízio em funções emocionalmente intensas',                         nivel: 'Organizacional', responsavel: 'Gerente de RH',        prazo: 180 },
        { acao: 'Apoio psicológico ocupacional',                                      nivel: 'Individual',     responsavel: 'Médico do Trabalho',   prazo: 180 },
      ]},
      { setor: 'Comercial', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir atendimento crítico contínuo por revezamento estruturado', nivel: 'Substituição',   responsavel: 'Diretor de Operações', prazo: 180 },
        { acao: 'Rodízio em funções emocionalmente intensas',                         nivel: 'Organizacional', responsavel: 'Gerente de RH',        prazo: 180 },
        { acao: 'Apoio psicológico ocupacional',                                      nivel: 'Individual',     responsavel: 'Médico do Trabalho',   prazo: 180 },
      ]},
    ],
  },
  {
    id: 'RPS-05', nome: 'Baixa autonomia',
    agravos: 'Desmotivação; Estresse',
    riscoAssociado: 'Sofrimento psicossocial',
    indicador: 'Influência no Trabalho',
    grupos: [
      { setor: 'Operações', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir controle rígido por modelo de autonomia supervisionada', nivel: 'Substituição',   responsavel: 'Diretor Executivo', prazo: 180 },
        { acao: 'Redesenho formal de cargos',                                       nivel: 'Organizacional', responsavel: 'Gerente de RH',     prazo: 180 },
        { acao: 'Plano de desenvolvimento de autonomia',                            nivel: 'Individual',     responsavel: 'Gestor do Setor',   prazo: 180 },
      ]},
      { setor: 'Atendimento ao Cliente', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir controle rígido por modelo de autonomia supervisionada', nivel: 'Substituição',   responsavel: 'Diretor Executivo', prazo: 180 },
        { acao: 'Redesenho formal de cargos',                                       nivel: 'Organizacional', responsavel: 'Gerente de RH',     prazo: 180 },
        { acao: 'Plano de desenvolvimento de autonomia',                            nivel: 'Individual',     responsavel: 'Gestor do Setor',   prazo: 180 },
      ]},
      { setor: 'Logística', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir controle rígido por modelo de autonomia supervisionada', nivel: 'Substituição',   responsavel: 'Diretor Executivo', prazo: 180 },
        { acao: 'Redesenho formal de cargos',                                       nivel: 'Organizacional', responsavel: 'Gerente de RH',     prazo: 180 },
        { acao: 'Plano de desenvolvimento de autonomia',                            nivel: 'Individual',     responsavel: 'Gestor do Setor',   prazo: 180 },
      ]},
    ],
  },
  {
    id: 'RPS-20', nome: 'Conflito trabalho-vida pessoal',
    agravos: 'Fadiga; Exaustão',
    riscoAssociado: 'Sobrecarga psicossocial',
    indicador: 'Conflito Trabalho-Família',
    grupos: [
      { setor: 'Operações', criticidade: 'Crítico', acoes: [
        { acao: 'Eliminar expectativa de disponibilidade contínua',               nivel: 'Eliminação',     responsavel: 'Diretor Executivo',    prazo: 30 },
        { acao: 'Substituir controle rígido de presença por foco em resultados',  nivel: 'Substituição',   responsavel: 'Diretor de Operações', prazo: 30 },
        { acao: 'Jornada flexível',                                               nivel: 'Organizacional', responsavel: 'Gerente de RH',        prazo: 30 },
        { acao: 'Limite formal de horas extras',                                  nivel: 'Administrativa', responsavel: 'Gerente de RH',        prazo: 30 },
        { acao: 'Ajuste individual de jornada',                                   nivel: 'Individual',     responsavel: 'Gerente de RH',        prazo: 30 },
      ]},
      { setor: 'Atendimento ao Cliente', criticidade: 'Crítico', acoes: [
        { acao: 'Eliminar expectativa de disponibilidade contínua',               nivel: 'Eliminação',     responsavel: 'Diretor Executivo',    prazo: 30 },
        { acao: 'Substituir controle rígido de presença por foco em resultados',  nivel: 'Substituição',   responsavel: 'Diretor de Operações', prazo: 30 },
        { acao: 'Jornada flexível',                                               nivel: 'Organizacional', responsavel: 'Gerente de RH',        prazo: 30 },
        { acao: 'Limite formal de horas extras',                                  nivel: 'Administrativa', responsavel: 'Gerente de RH',        prazo: 30 },
        { acao: 'Ajuste individual de jornada',                                   nivel: 'Individual',     responsavel: 'Gerente de RH',        prazo: 30 },
      ]},
      { setor: 'Tecnologia', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir controle rígido de presença por foco em resultados',  nivel: 'Substituição',   responsavel: 'Diretor de Operações', prazo: 180 },
        { acao: 'Jornada flexível',                                               nivel: 'Organizacional', responsavel: 'Gerente de RH',        prazo: 180 },
        { acao: 'Ajuste individual de jornada',                                   nivel: 'Individual',     responsavel: 'Gerente de RH',        prazo: 180 },
      ]},
      { setor: 'Comercial', criticidade: 'Moderado', acoes: [
        { acao: 'Substituir controle rígido de presença por foco em resultados',  nivel: 'Substituição',   responsavel: 'Diretor de Operações', prazo: 180 },
        { acao: 'Jornada flexível',                                               nivel: 'Organizacional', responsavel: 'Gerente de RH',        prazo: 180 },
        { acao: 'Ajuste individual de jornada',                                   nivel: 'Individual',     responsavel: 'Gerente de RH',        prazo: 180 },
      ]},
      { setor: 'Logística', criticidade: 'Alto', acoes: [
        { acao: 'Substituir controle rígido de presença por foco em resultados',  nivel: 'Substituição',   responsavel: 'Diretor de Operações', prazo: 90 },
        { acao: 'Jornada flexível',                                               nivel: 'Organizacional', responsavel: 'Gerente de RH',        prazo: 90 },
        { acao: 'Limite formal de horas extras',                                  nivel: 'Administrativa', responsavel: 'Gerente de RH',        prazo: 90 },
        { acao: 'Ajuste individual de jornada',                                   nivel: 'Individual',     responsavel: 'Gerente de RH',        prazo: 90 },
      ]},
    ],
  },
];

// ─── Helpers de cor ───────────────────────────────────────────────────────────

const NIVEL_COR: Record<Nivel, string> = {
  Baixo:    'text-green-700 font-bold',
  Moderado: 'text-amber-600 font-bold',
  Alto:     'text-orange-600 font-bold',
  Crítico:  'text-red-700 font-bold',
};

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function Th({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <th className={`border border-gray-300 bg-gray-50 px-3 py-2 text-[11px] font-semibold text-gray-600 ${center ? 'text-center' : 'text-left'}`}>
      {children}
    </th>
  );
}

function Td({ children, center, className = '', rowSpan, colSpan }: { children: React.ReactNode; center?: boolean; className?: string; rowSpan?: number; colSpan?: number }) {
  return (
    <td rowSpan={rowSpan} colSpan={colSpan} className={`border border-gray-300 px-3 py-2 text-xs text-gray-800 align-middle ${center ? 'text-center' : ''} ${className}`}>
      {children}
    </td>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-base font-bold text-gray-900 mb-4">{n}. {title}</h2>
      {children}
    </section>
  );
}

function RPSHeader({ rps, indicador }: { rps: RPSInventario | RPSAcao; indicador?: string }) {
  return (
    <div className="mb-2 mt-6">
      <p className="text-sm font-bold text-gray-900">{rps.id} - {rps.nome.toUpperCase()}</p>
      <p className="text-xs text-gray-800"><span className="font-bold">Agravos Potenciais:</span> {rps.agravos}</p>
      <p className="text-xs text-gray-800"><span className="font-bold">Risco Ocupacional Associado:</span> {rps.riscoAssociado}</p>
      {indicador && <p className="text-xs text-gray-800"><span className="font-bold">Indicador de melhoria:</span> {indicador}</p>}
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

const WIZARD_STEPS = ['Controles', 'Responsável', 'Observações', 'CIPA'];

export default function PGRPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const wizardComplete = completedCount === WIZARD_STEPS.length;

  return (
    <div className="flex overflow-hidden md:h-screen bg-gray-100 print:block print:h-auto print:bg-white print:overflow-visible">
      <div className="print:hidden">
        <AppSidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      </div>

      <main className="flex-1 min-w-0 md:overflow-y-auto print:overflow-visible">
        {/* Barra superior */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-3">
            <button className="p-2 -ml-2 md:hidden" onClick={() => setMobileSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
            <span className="text-sm font-semibold text-gray-900">
              Programa de Gerenciamento de Riscos (PGR) - Riscos Psicossociais
            </span>
          </div>
          <div className="relative group">
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5"
              disabled={!wizardComplete}
              onClick={() => wizardComplete && setTimeout(() => window.print(), 0)}
            >
              <FileDown className="w-3.5 h-3.5" />
              Exportar PDF
            </Button>
            {!wizardComplete && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-[var(--neutral-900)] text-white text-xs px-3 py-2.5 leading-relaxed shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Para exportar o documento, preencha todas as pendências do inventário.
                <div className="absolute -top-1.5 right-4 w-3 h-3 bg-[var(--neutral-900)] rotate-45" />
              </div>
            )}
          </div>
        </header>

        {/* Prototype bar */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 md:px-8 py-2 flex flex-wrap items-center gap-3 print:hidden">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 shrink-0">
            <Settings2 className="w-3.5 h-3.5" />
            Protótipo
          </div>
          <div className="h-3.5 w-px bg-amber-200 shrink-0" />
          <label className="flex items-center gap-1.5 text-xs text-amber-700 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={wizardComplete}
              onChange={e => setCompletedCount(e.target.checked ? WIZARD_STEPS.length : 0)}
              className="accent-amber-600"
            />
            Wizard completo
          </label>
          {!wizardComplete && (
            <>
              <div className="h-3.5 w-px bg-amber-200 shrink-0" />
              <span className="text-xs text-amber-700">Etapas concluídas:</span>
              {[0,1,2,3,4].map(n => (
                <label key={n} className="flex items-center gap-1 text-xs text-amber-700 cursor-pointer select-none">
                  <input type="radio" name="completedCount" checked={completedCount === n} onChange={() => setCompletedCount(n)} className="accent-amber-600" />
                  {n}
                </label>
              ))}
            </>
          )}
        </div>

        {/* Pending card */}
        {!wizardComplete && (
          <div className="max-w-4xl mx-auto mt-6 px-4 print:hidden">
            <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--neutral-100)]">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[var(--neutral-900)]">Informações pendentes</p>
                  <p className="text-xs text-[var(--neutral-500)] mt-0.5">Preencha as etapas abaixo para habilitar a exportação do documento.</p>
                </div>
                <Button variant="primary" size="sm" className="gap-1.5 shrink-0" onClick={() => router.push('/campanhas/1/inventario')}>
                  Preencher
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="px-6 py-4 flex flex-wrap gap-x-6 gap-y-2">
                {WIZARD_STEPS.map((step, i) => {
                  const done = i < completedCount;
                  return (
                    <div key={step} className="flex items-center gap-2">
                      {done
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        : <Circle className="w-4 h-4 text-[var(--neutral-300)] shrink-0" />}
                      <span className={`text-sm ${done ? 'text-[var(--neutral-500)] line-through' : 'text-[var(--neutral-700)] font-medium'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Documento */}
        <div className="max-w-4xl mx-auto my-8 px-4 print:max-w-none print:my-0 print:px-0">
          <div className="bg-white shadow-sm rounded print:shadow-none print:rounded-none">

            {/* Cabeçalho do documento */}
            <div className="flex items-start justify-between px-10 pt-8 pb-6 border-b border-gray-200">
              <FluirLogo height={28} variant="color" />
              <div className="text-right text-xs text-gray-500 leading-relaxed">
                <p>Riscos Psicossociais</p>
                <p>PGR/GRO</p>
              </div>
            </div>

            {/* Corpo */}
            <div className="px-10 py-8">

              {/* Título */}
              <div className="text-center mb-10">
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  Programa de Gerenciamento de Riscos (PGR) - Riscos Psicossociais
                </h1>
                <p className="text-sm text-gray-600">Inventário de Riscos e Plano de Ação</p>
              </div>

              {/* 1. Identificação */}
              <Section n="1" title="Identificação da Empresa">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr><Td className="bg-gray-50 font-semibold text-gray-500 uppercase tracking-wide text-[10px]" colSpan={2}>Dados Cadastrais</Td></tr>
                    <tr>
                      <Td className="font-medium w-56">Razão Social</Td>
                      <Td>{EMPRESA.razaoSocial}</Td>
                    </tr>
                    <tr>
                      <Td className="font-medium">CNPJ</Td>
                      <Td>{EMPRESA.cnpj}</Td>
                    </tr>
                    <tr>
                      <Td className="font-medium">Atividade Econômica</Td>
                      <Td>{EMPRESA.atividade}</Td>
                    </tr>
                    <tr>
                      <Td className="font-medium">Responsável pelo PGR Psicossocial</Td>
                      <Td>{EMPRESA.responsavel}</Td>
                    </tr>
                  </tbody>
                </table>
              </Section>

              {/* 2. Objetivo */}
              <Section n="2" title="Objetivo e escopo">
                <div className="space-y-3 text-sm text-gray-800 leading-relaxed">
                  <p>Este documento tem por objetivo identificar, avaliar, classificar e registrar fatores de risco psicossociais relacionados ao trabalho, para fins de integração ao Gerenciamento de Riscos Ocupacionais (GRO) da organização, nos termos da NR-01.</p>
                  <p>A avaliação abrange os setores e grupos expostos cadastrados pela organização no sistema, com consolidação dos resultados por contexto organizacional e registro correspondente no Inventário de Riscos.</p>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mt-5 mb-3">2.1 Dados da coleta</h3>
                <table className="w-full border-collapse mb-4">
                  <tbody>
                    {[
                      ['Período de coleta',    `${EMPRESA.coleta.inicio} a ${EMPRESA.coleta.fim}`],
                      ['População elegível',   `${EMPRESA.coleta.elegiveis} trabalhadores`],
                      ['Respondentes',         `${EMPRESA.coleta.respondentes} trabalhadores`],
                      ['Taxa de resposta',     EMPRESA.coleta.taxa],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <Td className="font-medium w-48">{k}</Td>
                        <Td>{v}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="space-y-3 text-sm text-gray-800 leading-relaxed">
                  <p>A coleta foi executada no Sistema Fluir, mediante aplicação do instrumento aos trabalhadores elegíveis durante o período indicado.</p>
                  <p>Os resultados foram consolidados pelo sistema por setor ou grupo exposto, conforme a estrutura organizacional cadastrada pela organização na plataforma, para fins de registro no Inventário de Riscos no âmbito do GRO.</p>
                </div>
              </Section>

              {/* 3. Base normativa */}
              <Section n="3" title="Base normativa e referencial">
                <div className="divide-y divide-gray-100 border border-gray-200 rounded text-sm">
                  {[
                    { codigo: 'NR-01',      descricao: 'Gerenciamento de Riscos Ocupacionais (GRO)' },
                    { codigo: 'ISO 45001',  descricao: 'Sistemas de Gestão de Segurança e Saúde no Trabalho' },
                    { codigo: 'ISO 45003',  descricao: 'Gestão de fatores de risco psicossociais relacionados ao trabalho' },
                  ].map(({ codigo, descricao }) => (
                    <div key={codigo} className="flex items-baseline gap-4 px-4 py-2.5">
                      <span className="font-semibold text-gray-900 w-24 shrink-0">{codigo}</span>
                      <span className="text-gray-700">{descricao}</span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* 4. Metodologia */}
              <Section n="4" title="Metodologia Sistema Fluir">
                <div className="space-y-3 text-sm text-gray-800 leading-relaxed">
                  <p>A avaliação foi conduzida por meio do Sistema Fluir, com aplicação de instrumento estruturado a partir do COPSOQ e itens adicionais para mapeamento de fatores de risco psicossociais relacionados ao trabalho. A metodologia assegura rastreabilidade entre os dados consolidados, os critérios de classificação e o registro no Inventário de Riscos, com detalhamento técnico apresentado nos anexos.</p>
                  <p>O procedimento compreendeu:</p>
                  <ul className="space-y-1 ml-4">
                    {[
                      'aplicação do instrumento e consolidação dos resultados por setor ou grupo exposto;',
                      'conversão dos resultados consolidados em probabilidade, conforme critérios metodológicos descritos no Anexo I;',
                      'atribuição de severidade, conforme critérios metodológicos aplicáveis ao modelo de avaliação adotado e descritos no Anexo I;',
                      'classificação do risco por matriz 4 × 4 e enquadramento em níveis (baixo, moderado, alto e crítico);',
                      'geração e registro do Inventário de Riscos no âmbito do GRO.',
                    ].map(item => <li key={item} className="flex gap-2 text-sm"><span className="text-gray-400 shrink-0">·</span>{item}</li>)}
                  </ul>
                  <p>Para fins de apresentação do inventário, a tabela de riscos apresenta a probabilidade final já ajustada conforme a maturidade declarada pela organização, conforme critérios metodológicos do sistema.</p>
                </div>
              </Section>

              {/* 5. Controles */}
              <Section n="5" title="Controles organizacionais declarados pela empresa">
                <div className="space-y-3 text-sm text-gray-800 leading-relaxed">
                  <p>Os controles e medidas de prevenção informados pela organização no momento da avaliação estão consolidados no Anexo II — Controles organizacionais declarados, com indicação de maturidade declarada quando aplicável. Exemplos de controles: código de conduta, canal de denúncia, política de jornada, treinamento de liderança e monitoramento de indicadores organizacionais.</p>
                  <p className="font-semibold text-gray-900 mt-4">Declaração padrão</p>
                  <p>As medidas de prevenção e controles organizacionais registrados neste documento foram declarados pela organização no momento da avaliação, sob sua responsabilidade. A aplicação de maturidade e eventual ajuste da probabilidade decorrem exclusivamente das regras metodológicas descritas no Anexo I. Este registro não contempla verificação técnica presencial no local de trabalho no âmbito desta etapa.</p>
                </div>
              </Section>

              {/* 6. Inventário */}
              <Section n="6" title="Inventário de riscos psicossociais">
                <div className="space-y-3 text-sm text-gray-800 leading-relaxed mb-6">
                  <p>O inventário a seguir apresenta, por setor ou grupo exposto, o registro dos perigos relacionados a riscos psicossociais no trabalho, o quantitativo de trabalhadores considerados no grupo, a probabilidade utilizada para classificação, a severidade, o escore (P × S) e a classificação resultante na matriz 4 × 4.</p>
                  <p>Os valores de trabalhadores por setor/grupo exposto correspondem à população elegível cadastrada e registrada na seção "Dados da coleta".</p>
                  <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Legenda — Classificação do Risco</p>
                    <ul className="space-y-1 text-xs">
                      <li className="text-green-700">Baixo: 1–4 pontos</li>
                      <li className="text-amber-600">Moderado: 5–8 pontos</li>
                      <li className="text-orange-600">Alto: 9–12 pontos</li>
                      <li className="text-red-700">Crítico: 13–16 pontos</li>
                    </ul>
                  </div>
                </div>

                {INVENTARIO.map(rps => (
                  <div key={rps.id}>
                    <RPSHeader rps={rps} />
                    <table className="w-full border-collapse mb-2">
                      <thead>
                        <tr>
                          <Th>Setor/Grupo exposto</Th>
                          <Th center>Trabalhadores expostos</Th>
                          <Th center>Probabilidade</Th>
                          <Th center>Severidade</Th>
                          <Th center>P×S</Th>
                          <Th>Classificação</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {rps.grupos.map((g, i) => (
                          <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                            <Td>{g.setor}</Td>
                            <Td center>{g.trabalhadores}</Td>
                            <Td center>{g.probabilidade}</Td>
                            <Td center>{g.severidade}</Td>
                            <Td center>{g.ps}</Td>
                            <Td><span className={NIVEL_COR[g.classificacao]}>{g.classificacao}</span></Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </Section>

              {/* 7. Plano de ação */}
              <Section n="7" title="Plano de ação">
                <p className="text-sm text-gray-800 leading-relaxed mb-6">
                  O plano de ação a seguir apresenta as medidas definidas para tratamento dos riscos psicossociais identificados no inventário deste PGR, organizadas conforme a classificação do risco e o setor ou grupo exposto. Para cada medida, estão indicados o nível de intervenção, o responsável, o prazo de implementação e o respectivo indicador de monitoramento.
                </p>

                {PLANO.map(rps => (
                  <div key={rps.id}>
                    <RPSHeader rps={rps} indicador={rps.indicador} />
                    <table className="w-full border-collapse mb-2">
                      <thead>
                        <tr>
                          <Th>Setor exposto</Th>
                          <Th>Criticidade</Th>
                          <Th>Ação proposta</Th>
                          <Th>Responsável</Th>
                          <Th center>Prazo (dias)</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {rps.grupos.flatMap((g) =>
                          g.acoes.map((a, ai) => (
                            <tr key={`${g.setor}-${ai}`}>
                              {ai === 0 && <Td rowSpan={g.acoes.length} className="font-medium">{g.setor}</Td>}
                              {ai === 0 && <Td rowSpan={g.acoes.length}><span className={NIVEL_COR[g.criticidade]}>{g.criticidade}</span></Td>}
                              <Td>{a.acao}</Td>
                              <Td>{a.responsavel}</Td>
                              <Td center>{a.prazo}</Td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ))}
              </Section>

              {/* Observações */}
              <section className="mb-8">
                <h2 className="text-base font-bold text-gray-900 mb-3">Observações e Recomendações</h2>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  --
                </div>
              </section>

              {/* 8. Anexos */}
              <Section n="8" title="Anexos">
                <p className="text-sm text-gray-800 leading-relaxed mb-4">
                  Os anexos a seguir têm por finalidade complementar o corpo principal do documento com o detalhamento técnico, metodológico e operacional aplicável à avaliação, ao registro dos controles declarados e à definição do plano de ação.
                </p>
                {[
                  { titulo: 'Anexo I — Referencial técnico', itens: [
                    'instrumento adotado e sua estrutura de aplicação;',
                    'critérios de consolidação dos dados;',
                    'conversão dos resultados para probabilidade;',
                    'faixas de probabilidade (1 a 4) com os respectivos intervalos e metodologia de conversão;',
                    'matriz de risco 4 × 4, com respectivas faixas e critérios de classificação;',
                    'critérios de atribuição de severidade;',
                    'legenda dos níveis de probabilidade e severidade;',
                    'parâmetros aplicáveis à versão do relatório;',
                    'critérios complementares, quando aplicáveis ao modelo de avaliação adotado;',
                    'regra de maturidade e seus efeitos sobre a probabilidade final.',
                  ]},
                  { titulo: 'Anexo II — Controles organizacionais declarados', itens: [
                    'relação dos controles e medidas organizacionais informados pela empresa no momento da avaliação, com respectiva classificação de maturidade quando aplicável.',
                    'data da declaração dos controles;',
                    'responsável pela declaração;',
                    'campo de observações, se houver.',
                  ]},
                  { titulo: 'Anexo III — Registro metodológico', itens: [
                    'período de abertura e encerramento da coleta;',
                    'canal de aplicação utilizado;',
                    'critérios de elegibilidade dos participantes;',
                    'número de respondentes;',
                    'taxa de resposta;',
                    'setores ou grupos efetivamente consolidados;',
                    'versão do instrumento e parâmetros adotados;',
                    'versão da metodologia ou versão do sistema, se existir;',
                    'regras de consolidação por setor ou grupo exposto;',
                    `critério de semelhança para formação dos grupos: ${EMPRESA.criterioSemelhanca};`,
                    'registros de exclusão metodológica, quando aplicáveis;',
                    'data de emissão do relatório.',
                  ]},
                  { titulo: 'Anexo IV — Plano de ação', itens: [
                    'critérios de priorização e seleção de ações;',
                    'critérios de aplicabilidade por tipo de risco e contexto organizacional;',
                    'parâmetros de definição de prazo conforme classificação do risco;',
                    'critérios de atribuição de responsáveis;',
                    'status da ação (aberta, em andamento, concluída);',
                    'data prevista de revisão;',
                    'evidência de implementação, quando aplicável;',
                    'indicadores de monitoramento;',
                    'registros de revisão, atualização e reprogramação do plano de ação.',
                  ]},
                ].map(anexo => (
                  <div key={anexo.titulo} className="mb-5">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{anexo.titulo}</p>
                    <ul className="space-y-1">
                      {anexo.itens.map(item => (
                        <li key={item} className="flex gap-2 text-sm text-gray-800">
                          <span className="text-gray-400 shrink-0">·</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 space-y-2 text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">Nota sobre os anexos</p>
                  <p>Os anexos indicados neste documento integram a estrutura técnica e metodológica do relatório, podendo ser apresentados de forma consolidada ou complementar, conforme o escopo da avaliação e o modelo de entrega adotado.</p>
                  <p>Quando aplicável, os anexos reúnem os parâmetros metodológicos, os registros operacionais da coleta, os controles organizacionais declarados e os elementos de suporte ao plano de ação correspondentes a esta avaliação.</p>
                </div>
              </Section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
