'use client';

import React, { useState, useEffect, useRef, useCallback, DragEvent } from 'react';
import { clsx } from 'clsx';
import { ArrowRight, Download, UploadCloud, FileSpreadsheet, X, CheckCircle2, XCircle, Search, ListChecks, Users, FileCheck, AlertCircle, RefreshCw, FileText, AlertTriangle, Share2 } from 'lucide-react';
import { Button } from '../button';
import { Modal } from '../modal';
import { Alert } from '../alert';

// ─── Types ────────────────────────────────────────────────────────────────────

type ColKey   = 'nome' | 'email' | 'nascimento' | 'cpf' | 'cnpj' | 'grupo';
type AnnotKey = 'nome' | 'email' | 'acesso' | 'cnpj' | 'grupo';
type Tab      = 'base' | 'pgr' | 'upload';

// ─── Table columns ────────────────────────────────────────────────────────────

const TABLE_COLS: { key: ColKey; label: string; annot: AnnotKey; optional?: boolean }[] = [
  { key: 'nome',       label: 'Nome',          annot: 'nome'   },
  { key: 'email',      label: 'E-mail',        annot: 'email',  optional: true },
  { key: 'nascimento', label: 'Data de Nasc.', annot: 'acesso' },
  { key: 'cpf',        label: 'CPF',           annot: 'acesso' },
  { key: 'cnpj',       label: 'CNPJ',          annot: 'cnpj'   },
  { key: 'grupo',      label: 'Grupo',         annot: 'grupo'  },
];

const HIGHLIGHT: Record<AnnotKey, ColKey[]> = {
  nome:   ['nome'],
  email:  ['email'],
  acesso: ['nascimento', 'cpf'],
  cnpj:   ['cnpj'],
  grupo:  ['grupo'],
};

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE: Record<ColKey, string>[] = [
  { nome: 'Ana Martins',      email: 'ana.martins@empresa.com',   nascimento: '14/02/1988', cpf: '148.302.765-11', cnpj: '12.345.678/0001-10', grupo: 'Administrativo' },
  { nome: 'Gabriela Mota',    email: 'g.mota@empresa.com',        nascimento: '12/12/1994', cpf: '705.396.841-77', cnpj: '12.345.678/0001-10', grupo: 'Atendimento'    },
  { nome: 'Camila Lima',      email: 'camila.lima@empresa.com',   nascimento: '05/11/1985', cpf: '319.604.287-33', cnpj: '12.345.678/0001-10', grupo: 'Comercial'      },
  { nome: 'Bruno Alves',      email: 'bruno.alves@empresa.com',   nascimento: '23/09/1991', cpf: '254.817.396-22', cnpj: '12.345.678/0001-10', grupo: 'Financeiro'     },
  { nome: 'Isabela Moura',    email: 'i.moura@empresa.com',       nascimento: '19/08/1992', cpf: '927.518.063-99', cnpj: '12.345.678/0001-10', grupo: 'Jurídico'       },
  { nome: 'Henrique Prado',   email: 'h.prado@empresa.com',       nascimento: '31/03/1986', cpf: '816.407.952-88', cnpj: '12.345.678/0001-10', grupo: 'Logística'      },
  { nome: 'Daniel Costa',     email: 'daniel.costa@empresa.com',  nascimento: '17/04/1993', cpf: '472.918.503-44', cnpj: '12.345.678/0001-10', grupo: 'Operações'      },
  { nome: 'Felipe Duarte',    email: 'f.duarte@empresa.com',      nascimento: '08/07/1987', cpf: '694.185.730-66', cnpj: '12.345.678/0001-10', grupo: 'Tecnologia'     },
];

// ─── Annotation content ───────────────────────────────────────────────────────

interface Section { heading?: React.ReactNode; text?: React.ReactNode; items?: string[] }

interface Annotation {
  title: string;
  badge?: string;
  sections: Section[];
}

const ANNOTATIONS: Record<AnnotKey, Annotation> = {
  nome: {
    title: 'Nome',
    sections: [
      { text: 'Usado para personalizar a experiência do trabalhador durante o preenchimento do questionário.' },
    ],
  },
  email: {
    title: 'E-mail',
    badge: 'Opcional',
    sections: [
      { text: 'Quando informado, é possível disparar os convites para o questionário diretamente por e-mail.' },
      { text: 'O QR Code para impressão e distribuição na empresa estará sempre disponível, com ou sem e-mail cadastrado.' },
    ],
  },
  acesso: {
    title: 'CPF e data de nascimento',
    sections: [
      {
        items: [
          'Servem para validar o acesso ao questionário.',
          'Após ler o QR Code, o trabalhador informa CPF e data de nascimento.',
          'O sistema confere se esses dados existem na base enviada pela empresa.',
          'Se houver correspondência, o questionário é liberado.',
          'Se não houver, o acesso não é autorizado.',
        ],
      },
    ],
  },
  cnpj: {
    title: 'CNPJ',
    sections: [
      {
        text: 'Indica de qual empresa o trabalhador faz parte.',
      },
      {
        heading: 'Quando houver grupo econômico, o sistema gera',
        items: [
          '1 documento consolidado com todos os CNPJs do grupo',
          'Inventários separados por CNPJ, com o recorte de cada um',
        ],
      },
      {
        text: 'Nos inventários por CNPJ, os grupos e riscos podem ser compartilhados com outros CNPJs do mesmo grupo econômico, pois a análise considera a base consolidada do grupo.',
      },
    ],
  },
  grupo: {
    title: 'Grupo',
    badge: 'Exigência NR-01',
    sections: [
      {
        heading: <><strong>A NR-01 exige agrupamento por semelhança.</strong> Os trabalhadores podem ser agrupados por</>,
        items: ['setor, unidade, função, turno, etc.', 'ou outro critério de semelhança definido pela empresa'],
      },
      {
        heading: 'Antes de enviar a base',
        items: [
          'confira se todos os trabalhadores foram vinculados a um grupo',
          'confira se o critério usado para formar os grupos faz sentido para a realidade da empresa',
        ],
      },
      { text: <><strong>Importante:</strong> cada grupo deve ter no mínimo 10 pessoas.</> },
    ],
  },
};

// ─── Upload ───────────────────────────────────────────────────────────────────

type ScreenState = 'idle' | 'processing' | 'warning' | 'success';

function UploadBase({ onSuccess, onReset }: { onSuccess: () => void; onReset: () => void }) {
  const [state,     setState]   = useState<ScreenState>('idle');
  const [timestamp, setTs]      = useState<string | null>(null);
  const [dragging,  setDragging] = useState(false);

  const simulate = () => {
    setTs(new Date().toLocaleString('pt-BR'));
    setState('processing');
    setTimeout(() => setState('warning'), 2500);
  };

  const reset = () => { setState('idle'); setTs(null); onReset(); };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    simulate();
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">

      {/* Info callout */}
      <div className="md:col-span-2">
        <Alert variant="info" noIcon>
          <ul className="space-y-1">
            <li className="flex items-start gap-2">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[var(--navy-600)] shrink-0" />
              A base enviada já deve conter os grupos dos trabalhadores.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[var(--navy-600)] shrink-0" />
              No próximo passo, você deverá informar qual foi o critério de agrupamento.
            </li>
          </ul>
        </Alert>
      </div>

      {/* Upload card */}
      <div className={clsx(
        'rounded-2xl border-t-4 border border-[var(--neutral-200)] bg-white p-6 flex flex-col gap-4 transition-all duration-300',
        state === 'idle' ? 'border-t-[var(--navy-500)]' : 'border-t-[var(--emerald-500)]'
      )}>
        <div>
          <h3 className="font-bold text-[var(--neutral-900)] text-base">Upload da Base</h3>
          <p className="text-sm text-[var(--neutral-500)] mt-0.5">Selecione o arquivo CSV dos trabalhadores da empresa</p>
        </div>

        {state === 'idle' ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={simulate}
            className={clsx(
              'flex-1 rounded-xl border-2 border-dashed cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center gap-3 py-12 px-6 text-center',
              dragging
                ? 'border-[var(--navy-400)] bg-[var(--navy-50)]'
                : 'border-[var(--neutral-200)] hover:border-[var(--navy-300)] hover:bg-[var(--neutral-50)]'
            )}
          >
            <div className="w-11 h-11 rounded-full bg-[var(--neutral-100)] flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-[var(--neutral-400)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--neutral-700)]">
                Arraste ou <span className="text-[var(--navy-700)] underline underline-offset-2">clique para selecionar</span>
              </p>
              <p className="text-xs text-[var(--neutral-400)] mt-1">Excel (.xlsx, .xls) ou CSV</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-[var(--neutral-50)] rounded-xl border border-[var(--neutral-200)]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                  <FileText className="w-5 h-5 text-[var(--navy-600)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[var(--neutral-500)] uppercase tracking-wider mb-0.5">Base enviada</p>
                  <p className="text-sm font-semibold text-[var(--neutral-900)] truncate">base-participantes.csv</p>
                  {timestamp && (
                    <p className="text-xs text-[var(--neutral-400)] mt-0.5">Enviado em {timestamp}</p>
                  )}
                </div>
              </div>
            </div>
            {state === 'processing' && (
              <div className="flex items-center gap-3 p-3 bg-[var(--emerald-50)] rounded-xl border border-[var(--emerald-100)]">
                <RefreshCw className="w-4 h-4 text-[var(--emerald-500)] animate-spin shrink-0" />
                <span className="text-sm font-medium text-[var(--emerald-700)]">Processando arquivo...</span>
              </div>
            )}
            {(state === 'warning' || state === 'success') && (
              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--neutral-200)] bg-white text-sm font-semibold text-[var(--neutral-700)] hover:bg-[var(--neutral-50)] hover:border-[var(--neutral-300)] transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                Enviar outro arquivo
              </button>
            )}
          </div>
        )}
      </div>

      {/* Validation card */}
      <div className={clsx(
        'rounded-2xl border-t-4 border border-[var(--neutral-200)] bg-white p-6 flex flex-col gap-4 transition-all duration-300',
        state === 'warning' ? 'border-t-amber-400' : (state === 'processing' || state === 'success') ? 'border-t-[var(--emerald-500)]' : 'border-t-[var(--neutral-300)]'
      )}>
        <div>
          <h3 className="font-bold text-[var(--neutral-900)] text-base">Leitura e Validação</h3>
          <p className="text-sm text-[var(--neutral-500)] mt-0.5">Status do processamento dos dados</p>
        </div>

        {state === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="w-11 h-11 rounded-full bg-[var(--neutral-100)] flex items-center justify-center">
              <Search className="w-5 h-5 text-[var(--neutral-400)]" />
            </div>
            <p className="text-sm text-[var(--neutral-400)]">Envie o arquivo para leitura</p>
          </div>
        )}

        {state === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-6 text-center">
            <div className="relative w-14 h-14">
              <RefreshCw className="w-14 h-14 text-[var(--emerald-500)] animate-spin opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[var(--emerald-500)]" />
              </div>
            </div>
            <div className="w-full">
              <p className="font-semibold text-base text-[var(--neutral-800)]">Analisando estrutura...</p>
              <div className="w-full bg-[var(--neutral-100)] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[var(--emerald-500)] h-full w-2/3 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {(state === 'warning' || state === 'success') && (
          <div className="flex-1 flex flex-col gap-2.5">
            {[
              'Recebimento da base concluído',
              'Leitura da estrutura finalizada',
              ...(state === 'success' ? ['Base conferida e válida'] : []),
            ].map(label => (
              <div key={label} className="flex items-center gap-3 p-2.5 rounded-xl border bg-[var(--neutral-50)] border-[var(--neutral-100)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--emerald-600)] shrink-0" />
                <span className="text-sm font-medium text-[var(--neutral-700)]">{label}</span>
              </div>
            ))}
            {state === 'warning' && (
              <button
                onClick={() => { setState('success'); onSuccess(); }}
                className="flex items-center gap-3 p-2.5 rounded-xl border bg-red-50 border-red-100 text-left w-full hover:bg-red-100 transition-colors"
              >
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-sm font-medium text-red-700">Corrija os erros e envie o arquivo novamente</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Overview section — appears after processing */}
      {(state === 'warning' || state === 'success') && (
        <div className="md:col-span-2 space-y-3">
          <p className="text-[10px] font-bold text-[var(--neutral-400)] uppercase tracking-widest">Visão Geral</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Participantes', value: '242', icon: Users,          hasError: false },
              { label: 'Grupos',        value: '16',  icon: ListChecks,     hasError: state === 'warning' },
              { label: 'CNPJs',         value: '05',  icon: FileSpreadsheet, hasError: state === 'warning' },
            ].map(({ label, value, icon: Icon, hasError }) => (
              <div key={label} className={clsx(
                'rounded-xl border bg-white p-4 flex items-center justify-between gap-2 overflow-hidden relative',
                hasError ? 'border-red-300' : 'border-[var(--neutral-200)]'
              )}>
                <div>
                  <p className={clsx('text-[10px] font-bold uppercase tracking-wider mb-1', hasError ? 'text-red-400' : 'text-[var(--neutral-400)]')}>{label}</p>
                  <p className={clsx('text-3xl font-bold leading-none', hasError ? 'text-red-600' : 'text-[var(--neutral-900)]')}>{value}</p>
                </div>
                <Icon className={clsx('w-10 h-10 shrink-0', hasError ? 'text-red-100' : 'text-[var(--neutral-100)]')} />
              </div>
            ))}
          </div>

          {/* Error details — only on warning */}
          {state === 'warning' && (
            <div className="space-y-2">
              {[
                { field: 'CNPJ',              detail: '2 registros com CNPJ inválido' },
                { field: 'Data de nascimento', detail: '5 registros com data em formato incorreto (esperado DD/MM/AAAA)' },
                { field: 'Grupo',             detail: '3 grupos com menos de 10 participantes: Jurídico (4), Logística (7), TI (3)' },
              ].map(({ field, detail }) => (
                <Alert key={field} variant="error" title={field}>
                  {detail}
                </Alert>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PGR preview data ─────────────────────────────────────────────────────────

type Classification  = 'Baixo' | 'Moderado' | 'Alto';
type PgrColKey       = 'grupo' | 'trabalhadores' | 'probabilidade' | 'severidade' | 'ps' | 'classificacao';
type PgrAnnotKey     = 'grupo' | 'trabalhadores' | 'resultado';

interface PgrRow {
  grupo: string;
  trabalhadores: number;
  probabilidade: number;
  severidade: number;
}

const PGR_ROWS: PgrRow[] = [
  { grupo: 'Operações',   trabalhadores: 24, probabilidade: 4, severidade: 2 },
  { grupo: 'Atendimento', trabalhadores: 20, probabilidade: 4, severidade: 2 },
  { grupo: 'Tecnologia',  trabalhadores: 18, probabilidade: 1, severidade: 2 },
  { grupo: 'Comercial',   trabalhadores: 15, probabilidade: 2, severidade: 2 },
  { grupo: 'Logística',   trabalhadores: 12, probabilidade: 4, severidade: 2 },
];

const PGR_COLS: { key: PgrColKey; label: string; short: string; annot: PgrAnnotKey }[] = [
  { key: 'grupo',          label: 'Grupo exposto',          short: 'Grupo',    annot: 'grupo'        },
  { key: 'trabalhadores',  label: 'Trabalhadores expostos', short: 'Trab.',    annot: 'trabalhadores' },
  { key: 'probabilidade',  label: 'Probabilidade',          short: 'Prob.',    annot: 'resultado'    },
  { key: 'severidade',     label: 'Severidade',             short: 'Sev.',     annot: 'resultado'    },
  { key: 'ps',             label: 'P×S',                    short: 'P×S',      annot: 'resultado'    },
  { key: 'classificacao',  label: 'Classificação',          short: 'Classif.', annot: 'resultado'    },
];

const PGR_HIGHLIGHT: Record<PgrAnnotKey, PgrColKey[]> = {
  grupo:          ['grupo'],
  trabalhadores:  ['trabalhadores'],
  resultado:      ['probabilidade', 'severidade', 'ps', 'classificacao'],
};

const PGR_ANNOTATIONS: Record<PgrAnnotKey, Annotation> = {
  grupo: {
    title: 'Grupo exposto',
    sections: [
      { text: 'Este é o grupo que você criou na base de trabalhadores. Cada grupo reúne trabalhadores com perfil semelhante de exposição a riscos.' },
      { text: 'Após enviar a base, você informará qual foi o critério de agrupamento utilizado.' },
    ],
  },
  trabalhadores: {
    title: 'Trabalhadores expostos',
    sections: [
      { text: 'Total de pessoas neste grupo incluídas no mapeamento.' },
    ],
  },
  resultado: {
    title: 'Resultado do mapeamento',
    sections: [
      { text: 'Esses valores são calculados automaticamente pelo sistema com base nas respostas do questionário.' },
    ],
  },
};

function classify(ps: number): Classification {
  if (ps >= 9) return 'Alto';
  if (ps >= 4) return 'Moderado';
  return 'Baixo';
}

const CLASSIFICATION_STYLE: Record<Classification, string> = {
  Alto:     'text-red-600 font-bold',
  Moderado: 'text-amber-600 font-bold',
  Baixo:    'text-emerald-600 font-bold',
};

function PgrPreview() {
  const [activeAnnot, setActiveAnnot] = useState<PgrAnnotKey>('grupo');
  const [visible,     setVisible]     = useState(false);
  const [cardLeft,    setCardLeft]    = useState(0);
  const [tipLeft,     setTipLeft]     = useState(0);
  const [cardW,       setCardW]       = useState(380);
  const [cardTop,     setCardTop]     = useState(52);

  const containerRef   = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const theadRef       = useRef<HTMLTableSectionElement>(null);
  const thRefs         = useRef<Partial<Record<PgrColKey, HTMLTableCellElement | null>>>({});
  const tdFirstRefs    = useRef<Partial<Record<PgrColKey, HTMLTableCellElement | null>>>({});
  const activeAnnotRef = useRef<PgrAnnotKey>(activeAnnot);

  const computePosition = useCallback((annot: PgrAnnotKey) => {
    const box = containerRef.current;
    if (!box) return;
    const br = box.getBoundingClientRect();
    let center: number;

    if (annot === 'resultado') {
      const p = thRefs.current['probabilidade'];
      const c = thRefs.current['classificacao'];
      if (!p || !c) return;
      center = (p.getBoundingClientRect().left + c.getBoundingClientRect().right) / 2 - br.left;
      const firstTd = tdFirstRefs.current['probabilidade'];
      if (firstTd) setCardTop(firstTd.getBoundingClientRect().bottom - br.top + 10);
    } else {
      const th = thRefs.current[annot as PgrColKey];
      if (!th) return;
      const r = th.getBoundingClientRect();
      center = r.left - br.left + r.width / 2;
      const firstTd = tdFirstRefs.current[annot as PgrColKey];
      if (firstTd) setCardTop(firstTd.getBoundingClientRect().bottom - br.top + 10);
    }

    if (!tdFirstRefs.current['grupo'] && theadRef.current) {
      setCardTop(theadRef.current.getBoundingClientRect().bottom - br.top + 10);
    }

    const cw   = br.width >= 900 ? 520 : br.width >= 600 ? 400 : 300;
    const pad  = 8;
    const left = Math.max(pad, Math.min(br.width - cw - pad, center - cw / 2));
    setCardW(cw);
    setCardLeft(left);
    setTipLeft(center - left);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { computePosition('grupo'); setVisible(true); }, 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    activeAnnotRef.current = activeAnnot;
    computePosition(activeAnnot);

    // Mobile: scroll table to center the active column(s)
    const scrollEl = tableScrollRef.current;
    if (scrollEl) {
      if (activeAnnot === 'resultado') {
        const thLast = thRefs.current['classificacao'];
        if (thLast) {
          const scrollLeft = thLast.offsetLeft + thLast.offsetWidth - scrollEl.clientWidth;
          scrollEl.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
        }
      } else {
        const th = thRefs.current[activeAnnot];
        if (th) {
          const scrollLeft = th.offsetLeft - scrollEl.clientWidth / 2 + th.offsetWidth / 2;
          scrollEl.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
        }
      }
    }
  }, [activeAnnot, computePosition]);

  useEffect(() => {
    const handler = () => computePosition(activeAnnotRef.current);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [computePosition]);

  const highlighted = PGR_HIGHLIGHT[activeAnnot];
  const annot       = PGR_ANNOTATIONS[activeAnnot];

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--neutral-600)]">
        Veja como os grupos da sua base aparecem no inventário de riscos do PGR após o mapeamento.
      </p>

      {/* containerRef wraps everything; card is sibling of overflow-hidden div */}
      <div ref={containerRef} className="relative overflow-hidden sm:overflow-visible">

        {/* Mobile annotation card — above table */}
        <div className="sm:hidden mb-3 rounded-xl overflow-hidden shadow-md" style={{ border: '1.5px solid #1e1b4b' }}>
          <div className="px-4 py-2.5 bg-[var(--navy-900)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-widest leading-none">
                {annot.title}
              </span>
              {annot.badge && (
                <span className="bg-[var(--emerald-500)] text-[var(--navy-900)] text-[10px] px-1.5 py-0.5 rounded font-bold leading-none shrink-0">
                  {annot.badge}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                const order: PgrAnnotKey[] = ['grupo', 'trabalhadores', 'resultado'];
                const idx  = order.indexOf(activeAnnot);
                const next = order[(idx + 1) % order.length];
                setActiveAnnot(next);
              }}
              className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-white transition-colors shrink-0"
            >
              Próximo <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="px-4 py-3 bg-white space-y-3">
            {annot.sections.map((s, i) => (
              <div key={i} className="space-y-1">
                {s.heading && (
                  <p className="text-sm font-semibold text-[var(--neutral-800)] leading-snug">{s.heading}</p>
                )}
                {s.text && (
                  <p className="text-sm text-[var(--neutral-700)] leading-relaxed">{s.text}</p>
                )}
                {s.items && (
                  <ul className="space-y-1">
                    {s.items.map((item, j) => (
                      <li key={j} className="text-sm text-[var(--neutral-700)] flex items-start gap-2">
                        <span className="mt-[9px] w-1 h-1 rounded-full bg-[var(--neutral-400)] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--neutral-200)] overflow-hidden shadow-sm">
          {/* Risk header */}
          <div className="px-6 py-4 bg-[var(--neutral-50)] border-b border-[var(--neutral-200)]">
            <p className="font-bold text-[var(--neutral-900)] text-sm">RPS-01 - SOBRECARGA QUANTITATIVA</p>
            <p className="text-sm text-[var(--neutral-700)] mt-1">
              <span className="font-semibold">Agravos Potenciais:</span> Fadiga; Exaustão; Burnout
            </p>
            <p className="text-sm text-[var(--neutral-700)]">
              <span className="font-semibold">Risco Ocupacional Associado:</span> Estresse ocupacional crônico
            </p>
          </div>

          {/* Risk table */}
          <div ref={tableScrollRef} className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm border-collapse">
            <thead ref={theadRef}>
              <tr className="border-b border-[var(--neutral-200)]">
                {PGR_COLS.map(c => (
                  <th
                    key={c.key}
                    ref={el => { thRefs.current[c.key] = el; }}
                    onClick={() => setActiveAnnot(c.annot)}
                    className={clsx(
                      'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200 border-b border-[var(--neutral-200)]',
                      highlighted.includes(c.key)
                        ? 'bg-[var(--navy-900)] text-white'
                        : 'bg-white text-[var(--neutral-400)] hover:text-[var(--neutral-600)] hover:bg-[var(--neutral-100)]'
                    )}
                  >
                    <span className="hidden sm:inline">{c.label}</span>
                    <span className="sm:hidden">{c.short}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--neutral-100)]">
              {PGR_ROWS.map(row => {
                const ps    = row.probabilidade * row.severidade;
                const label = classify(ps);
                const vals: Record<PgrColKey, string> = {
                  grupo:         row.grupo,
                  trabalhadores: String(row.trabalhadores),
                  probabilidade: String(row.probabilidade),
                  severidade:    String(row.severidade),
                  ps:            String(ps),
                  classificacao: label,
                };
                return (
                  <tr key={row.grupo}>
                    {PGR_COLS.map(c => (
                      <td
                        key={c.key}
                        ref={row.grupo === PGR_ROWS[0].grupo ? (el => { tdFirstRefs.current[c.key] = el; }) : undefined}
                        onClick={() => setActiveAnnot(c.annot)}
                        className={clsx(
                          'px-4 py-3 cursor-pointer transition-colors duration-200',
                          highlighted.includes(c.key)
                            ? 'bg-[var(--navy-50)] text-[var(--navy-900)] font-medium'
                            : 'text-[var(--neutral-400)]',
                          c.key === 'classificacao' && highlighted.includes('classificacao')
                            ? CLASSIFICATION_STYLE[label]
                            : ''
                        )}
                      >
                        {vals[c.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* Floating annotation card — desktop only */}
        <div
          className="absolute z-10 pointer-events-none hidden sm:block"
          style={{
            top: cardTop,
            left: cardLeft,
            width: cardW,
            opacity:    visible ? 1 : 0,
            transform:  visible ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease, left 0.25s ease, top 0s',
          }}
        >
          <div style={{
            position: 'absolute', top: -9, left: tipLeft - 9,
            width: 0, height: 0,
            borderLeft: '9px solid transparent', borderRight: '9px solid transparent',
            borderBottom: '9px solid #1e1b4b',
            transition: 'left 0.25s ease',
          }} />
          <div style={{
            position: 'absolute', top: -7, left: tipLeft - 7,
            width: 0, height: 0,
            borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
            borderBottom: '7px solid #1e1b4b',
            transition: 'left 0.25s ease',
          }} />
          <div className="rounded-xl overflow-hidden shadow-2xl" style={{ border: '1.5px solid #1e1b4b' }}>
            <div className="px-4 py-2.5 bg-[var(--navy-900)] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-widest leading-none">
                  {annot.title}
                </span>
                {annot.badge && (
                  <span className="bg-[var(--emerald-500)] text-[var(--navy-900)] text-[10px] px-1.5 py-0.5 rounded font-bold leading-none shrink-0">
                    {annot.badge}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  const order: PgrAnnotKey[] = ['grupo', 'trabalhadores', 'resultado'];
                  const idx  = order.indexOf(activeAnnot);
                  const next = order[(idx + 1) % order.length];
                  setActiveAnnot(next);
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-white transition-colors pointer-events-auto shrink-0"
              >
                Próximo <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="px-4 py-3 bg-white space-y-3">
              {annot.sections.map((s, i) => (
                <div key={i} className="space-y-1">
                  {s.heading && (
                    <p className="text-sm font-semibold text-[var(--neutral-800)] leading-snug">{s.heading}</p>
                  )}
                  {s.text && (
                    <p className="text-sm text-[var(--neutral-700)] leading-relaxed">{s.text}</p>
                  )}
                  {s.items && (
                    <ul className="space-y-1">
                      {s.items.map((item, j) => (
                        <li key={j} className="text-sm text-[var(--neutral-700)] flex items-start gap-2">
                          <span className="mt-[9px] w-1 h-1 rounded-full bg-[var(--neutral-400)] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { onNext: () => void }

const ANNOT_ORDER: AnnotKey[] = ['nome', 'email', 'acesso', 'cnpj', 'grupo'];

export default function StepPrepareBase({ onNext }: Props) {
  const [uploadReady,  setUploadReady]  = useState(false);
  const [activeTab,    setActiveTab]    = useState<Tab>('base');
  const [showRules,    setShowRules]    = useState(true);
  const [activeAnnot, setActiveAnnot]  = useState<AnnotKey>('nome');
  const [visible,     setVisible]      = useState(false);
  const [cardLeft,    setCardLeft]     = useState(0);
  const [tipLeft,     setTipLeft]      = useState(0);
  const [cardW,       setCardW]        = useState(380);
  const [cardTop,     setCardTop]      = useState(52);

  const containerRef   = useRef<HTMLDivElement>(null);
  const tabSectionRef  = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const thRefs         = useRef<Partial<Record<ColKey, HTMLTableCellElement | null>>>({});
  const tdFirstRefs    = useRef<Partial<Record<ColKey, HTMLTableCellElement | null>>>({});
  const activeAnnotRef = useRef<AnnotKey>(activeAnnot);

  const computePosition = useCallback((annot: AnnotKey) => {
    const box = containerRef.current;
    if (!box) return;
    const br = box.getBoundingClientRect();
    let center: number;

    if (annot === 'acesso') {
      const n = thRefs.current['nascimento'];
      const c = thRefs.current['cpf'];
      if (!n || !c) return;
      center = (n.getBoundingClientRect().left + c.getBoundingClientRect().right) / 2 - br.left;
      const firstTd = tdFirstRefs.current['nascimento'];
      if (firstTd) setCardTop(firstTd.getBoundingClientRect().bottom - br.top + 10);
    } else {
      const anchorKey: ColKey = annot === 'nome' ? 'nome' : annot === 'email' ? 'email' : annot === 'cnpj' ? 'cnpj' : 'grupo';
      const th = thRefs.current[anchorKey];
      if (!th) return;
      const r = th.getBoundingClientRect();
      center = r.left - br.left + r.width / 2;
      const firstTd = tdFirstRefs.current[anchorKey];
      if (firstTd) setCardTop(firstTd.getBoundingClientRect().bottom - br.top + 10);
    }

    const cw   = br.width >= 900 ? 520 : br.width >= 600 ? 400 : 300;
    const pad  = 8;
    const left = Math.max(pad, Math.min(br.width - cw - pad, center - cw / 2));
    setCardW(cw);
    setCardLeft(left);
    setTipLeft(center - left);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => { computePosition('nome'); setVisible(true); }, 650);
    return () => { clearTimeout(t1); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset to first annotation when switching to base tab
  useEffect(() => {
    if (activeTab === 'base') {
      setActiveAnnot('nome');
      setTimeout(() => computePosition('nome'), 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);


  useEffect(() => {
    activeAnnotRef.current = activeAnnot;
    computePosition(activeAnnot);

    // Mobile: scroll table to center the active column
    const scrollEl = tableScrollRef.current;
    if (scrollEl) {
      const anchorKey = HIGHLIGHT[activeAnnot][0] as ColKey;
      const th = thRefs.current[anchorKey];
      if (th) {
        const scrollLeft = th.offsetLeft - scrollEl.clientWidth / 2 + th.offsetWidth / 2;
        scrollEl.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
      }
    }
  }, [activeAnnot, computePosition]);

  useEffect(() => {
    const handler = () => computePosition(activeAnnotRef.current);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [computePosition]);

  const highlighted = HIGHLIGHT[activeAnnot];
  const annot       = ANNOTATIONS[activeAnnot];

  return (
    <div ref={tabSectionRef} className="space-y-6">
      {/* Header */}
      <section className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[var(--neutral-900)]">
            Enviar base
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowRules(true)}>
            <ListChecks className="hidden sm:block w-3.5 h-3.5" />
            <span className="sm:hidden">Instruções</span>
            <span className="hidden sm:inline">Instruções</span>
          </Button>
          {/* Mobile: share */}
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden"
            onClick={() => navigator.share?.({ title: 'Modelo de base de trabalhadores', url: window.location.origin + '/exemplo-base-colaboradores.xlsx' })}
          >
            Exemplo
          </Button>
          {/* Desktop: download */}
          <a
            href="/exemplo-base-colaboradores.xlsx"
            download
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[var(--neutral-300)] text-sm font-medium text-[var(--neutral-700)] bg-white hover:bg-[var(--neutral-50)] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Baixar modelo
          </a>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--neutral-200)]">
        {([
          { key: 'upload', short: 'Enviar base',  long: 'Enviar base'        },
          { key: 'base',   short: 'Exemplo',      long: 'Exemplo de base'    },
          { key: 'pgr',    short: 'No PGR',       long: 'Como fica no PGR'   },
        ] as { key: Tab; short: string; long: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={clsx(
              'px-3 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap',
              activeTab === t.key
                ? 'border-[var(--navy-900)] text-[var(--navy-900)]'
                : 'border-transparent text-[var(--neutral-500)] hover:text-[var(--neutral-700)]'
            )}
          >
            <span className="sm:hidden">{t.short}</span>
            <span className="hidden sm:inline">{t.long}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'pgr' ? (
        <PgrPreview />
      ) : activeTab === 'upload' ? (
        <UploadBase onSuccess={() => setUploadReady(true)} onReset={() => setUploadReady(false)} />
      ) : (
        /* Table + floating annotation */
        <div ref={containerRef} className="relative overflow-hidden sm:overflow-visible">

          {/* Mobile annotation card — above table */}
          <div className="sm:hidden mb-3 rounded-xl overflow-hidden shadow-md" style={{ border: '1.5px solid #1e1b4b' }}>
            <div className="px-4 py-2.5 bg-[var(--navy-900)] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-widest leading-none">
                  {annot.title}
                </span>
                {annot.badge && (
                  <span className="bg-[var(--emerald-500)] text-[var(--navy-900)] text-[10px] px-1.5 py-0.5 rounded font-bold leading-none shrink-0">
                    {annot.badge}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  const idx  = ANNOT_ORDER.indexOf(activeAnnot);
                  const next = ANNOT_ORDER[(idx + 1) % ANNOT_ORDER.length];
                  setActiveAnnot(next);
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-white transition-colors shrink-0"
              >
                Próximo <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="px-4 py-3 bg-white space-y-3">
              {annot.sections.map((s, i) => (
                <div key={i} className="space-y-1">
                  {s.heading && (
                    <p className="text-sm font-semibold text-[var(--neutral-800)] leading-snug">{s.heading}</p>
                  )}
                  {s.text && (
                    <p className="text-sm text-[var(--neutral-700)] leading-relaxed">{s.text}</p>
                  )}
                  {s.items && (
                    <ul className="space-y-1">
                      {s.items.map((item, j) => (
                        <li key={j} className="text-sm text-[var(--neutral-700)] flex items-start gap-2">
                          <span className="mt-[9px] w-1 h-1 rounded-full bg-[var(--neutral-400)] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-[var(--neutral-200)] overflow-hidden shadow-sm">
            <div ref={tableScrollRef} className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm border-collapse">
              <thead>
                <tr>
                  {TABLE_COLS.map(c => (
                    <th
                      key={c.key}
                      ref={el => { thRefs.current[c.key] = el; }}
                      onClick={() => setActiveAnnot(c.annot)}
                      className={clsx(
                        'px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider cursor-pointer transition-colors duration-200 border-b border-[var(--neutral-200)]',
                        highlighted.includes(c.key)
                          ? 'bg-[var(--navy-900)] text-white'
                          : c.key === 'grupo'
                            ? 'bg-amber-50 text-[var(--neutral-400)] hover:text-[var(--neutral-600)] hover:bg-amber-100'
                            : 'bg-[var(--neutral-50)] text-[var(--neutral-400)] hover:text-[var(--neutral-600)] hover:bg-[var(--neutral-100)]'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {c.label}
                        {c.optional && (
                          <span className={clsx(
                            'text-[9px] px-1.5 py-0.5 rounded font-bold leading-none normal-case tracking-normal',
                            highlighted.includes(c.key)
                              ? 'bg-white/20 text-white'
                              : 'bg-[var(--neutral-200)] text-[var(--neutral-500)]'
                          )}>
                            Opcional
                          </span>
                        )}
                        {c.key === 'grupo' && (
                          <span className={clsx(
                            'text-[9px] px-1.5 py-0.5 rounded font-bold leading-none normal-case tracking-normal',
                            highlighted.includes(c.key)
                              ? 'bg-[var(--emerald-500)] text-[var(--navy-900)]'
                              : 'bg-amber-200 text-amber-700'
                          )}>
                            NR-01
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--neutral-100)]">
                {SAMPLE.map((row, i) => (
                  <tr key={i}>
                    {TABLE_COLS.map(c => (
                      <td
                        key={c.key}
                        ref={i === 0 ? (el => { tdFirstRefs.current[c.key] = el; }) : undefined}
                        onClick={() => setActiveAnnot(c.annot)}
                        className={clsx(
                          'px-4 py-2.5 cursor-pointer transition-colors duration-200',
                          highlighted.includes(c.key)
                            ? 'bg-[var(--navy-50)] text-[var(--navy-900)] font-medium'
                            : 'text-[var(--neutral-400)]'
                        )}
                      >
                        {row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Floating annotation card — desktop only */}
          <div
            className="absolute z-10 pointer-events-none hidden sm:block"
            style={{
              top: cardTop,
              left: cardLeft,
              width: cardW,
              opacity:    visible ? 1 : 0,
              transform:  visible ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease, left 0.25s ease',
            }}
          >
            {/* Arrow */}
            <div style={{
              position: 'absolute', top: -9, left: tipLeft - 9,
              width: 0, height: 0,
              borderLeft: '9px solid transparent', borderRight: '9px solid transparent',
              borderBottom: '9px solid #1e1b4b',
              transition: 'left 0.25s ease',
            }} />
            <div style={{
              position: 'absolute', top: -7, left: tipLeft - 7,
              width: 0, height: 0,
              borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
              borderBottom: '7px solid #1e1b4b',
              transition: 'left 0.25s ease',
            }} />

            {/* Card */}
            <div className="rounded-xl overflow-hidden shadow-2xl" style={{ border: '1.5px solid #1e1b4b' }}>
              <div className="px-4 py-2.5 bg-[var(--navy-900)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-widest leading-none">
                    {annot.title}
                  </span>
                  {annot.badge && (
                    <span className="bg-[var(--emerald-500)] text-[var(--navy-900)] text-[10px] px-1.5 py-0.5 rounded font-bold leading-none shrink-0">
                      {annot.badge}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    const idx  = ANNOT_ORDER.indexOf(activeAnnot);
                    const next = ANNOT_ORDER[(idx + 1) % ANNOT_ORDER.length];
                    setActiveAnnot(next);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-white transition-colors pointer-events-auto shrink-0"
                >
                  Próximo <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="px-4 py-3 bg-white space-y-3">
                {annot.sections.map((s, i) => (
                  <div key={i} className="space-y-1">
                    {s.heading && (
                      <p className="text-sm font-semibold text-[var(--neutral-800)] leading-snug">
                        {s.heading}
                      </p>
                    )}
                    {s.text && (
                      <p className="text-sm text-[var(--neutral-700)] leading-relaxed">{s.text}</p>
                    )}
                    {s.items && (
                      <ul className="space-y-1">
                        {s.items.map((item, j) => (
                          <li key={j} className="text-sm text-[var(--neutral-700)] flex items-start gap-2">
                            <span className="mt-[9px] w-1 h-1 rounded-full bg-[var(--neutral-400)] shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      <div className="flex justify-end pt-6 border-t border-[var(--neutral-200)]">
        {activeTab === 'upload' ? (
          <Button variant="primary" size="lg" className="gap-2 group" onClick={onNext} disabled={!uploadReady}>
            Continuar
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        ) : (
          <Button variant="primary" size="lg" onClick={() => setActiveTab('upload')}>
            Entendi
          </Button>
        )}
      </div>

      {/* Instructions modal */}
      <Modal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        title="Instruções"
        size="lg"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="outline" size="md" className="flex-1 justify-center" onClick={() => { setShowRules(false); setActiveTab('base'); }}>
              Ver exemplo
            </Button>
            <Button variant="primary" size="md" className="flex-1 justify-center" onClick={() => setShowRules(false)}>
              Começar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-[var(--navy-900)] px-4 py-3">
            <p className="text-sm font-bold text-white leading-snug">
              O primeiro passo é preparar a base de trabalhadores
            </p>
            <p className="text-xs text-white/70 mt-1 leading-relaxed hidden sm:block">
              Preparamos orientações e um exemplo para guiar você nessa etapa.
            </p>
          </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {/* Card 1 */}
          <div className="rounded-xl border border-[var(--neutral-200)] p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--navy-700)] shrink-0" />
              <p className="font-semibold text-[var(--neutral-900)] text-sm leading-none">Antes de enviar a base</p>
            </div>
            <ul className="space-y-2">
              {[
                'Defina quem responderá à pesquisa',
                'Agrupe os trabalhadores em grupos por semelhança',
                'Crie grupos com no mínimo 10 trabalhadores',
                'Prepare o arquivo de acordo com o modelo',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--neutral-700)] leading-snug">
                  <CheckCircle2 className="w-4 h-4 text-[var(--emerald-500)] shrink-0 mt-[1px]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-[var(--neutral-200)] p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[var(--navy-700)] shrink-0" />
              <p className="font-semibold text-[var(--neutral-900)] text-sm leading-none">O arquivo deve</p>
            </div>
            <ul className="space-y-2">
              {[
                'Estar em formato CSV',
                'Ter no máximo 10 MB',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--neutral-700)] leading-snug">
                  <CheckCircle2 className="w-4 h-4 text-[var(--emerald-500)] shrink-0 mt-[1px]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex-1 pt-4 border-t border-[var(--neutral-100)] flex items-center justify-center">
              {/* Mobile: share if available */}
              <button
                onClick={() => navigator.share?.({ title: 'Modelo de base de trabalhadores', url: window.location.origin + '/exemplo-base-colaboradores.xlsx' })}
                className="sm:hidden flex items-center gap-1.5 text-sm text-[var(--navy-700)] hover:text-[var(--navy-900)] font-medium transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                Compartilhar modelo
              </button>
              {/* Desktop: always download */}
              <a
                href="/exemplo-base-colaboradores.xlsx"
                download
                className="hidden sm:flex items-center gap-1.5 text-sm text-[var(--navy-700)] hover:text-[var(--navy-900)] font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar modelo
              </a>
            </div>
          </div>
        </div>
        </div>
      </Modal>
    </div>
  );
}
