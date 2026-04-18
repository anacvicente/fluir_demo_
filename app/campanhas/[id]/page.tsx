'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronLeft, Menu, Users, Calendar, BarChart2, CheckCircle2,
  Clock, TrendingUp, X, Share2, Bell, CalendarPlus, Pause, Play,
  StopCircle, Settings2, Copy, Check, AlertTriangle,
  QrCode, BookOpen, Download, ChevronDown, Mail, MessageCircle, FileText, ArrowRight,
} from 'lucide-react';
import { clsx } from 'clsx';
import { AppSidebar } from '@/components/fluir/app-sidebar';
import { Button } from '@/components/fluir/button';
import { Badge } from '@/components/fluir/badge';
import { Modal, ConfirmModal } from '@/components/fluir/modal';
import { Drawer } from '@/components/fluir/drawer';

// ─── Types ────────────────────────────────────────────────────────────────────

type CampaignStatus = 'collecting' | 'paused' | 'closed';
type ActiveModal    = 'qrcode' | 'remind' | 'extend' | 'pause' | 'resume' | 'close-early' | null;

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_CAMPAIGN = {
  name: 'Mapeamento 2025.1',
  startDate: '2025-03-10',
  endDate: '2025-04-20',
  totalWorkers: 139,
  responses: 87,
  groups: [
    { name: 'Administrativo',         workers: 32, responses: 26 },
    { name: 'Operações',              workers: 45, responses: 31 },
    { name: 'Atendimento ao Cliente', workers: 28, responses: 18 },
    { name: 'Logística',              workers: 19, responses: 8  },
    { name: 'Tecnologia',             workers: 15, responses: 4  },
  ],
};

const SHARE_LINK = 'https://responder.fluir.vc/c/mape-2025-1';

type MaterialMoment = 'convite' | 'lembrete' | 'reta-final';

const MOMENT_LABELS: Record<MaterialMoment, string> = {
  convite:    'Convite',
  lembrete:   'Lembrete',
  'reta-final': 'Reta final',
};

const MATERIALS: Record<MaterialMoment, {
  whatsapp: string;
  emailSubject: string;
  emailBody: string;
  cartaz: string;
}> = {
  convite: {
    whatsapp:     `Olá! Nossa empresa está realizando um mapeamento de saúde e clima no trabalho em parceria com a Fluir. Sua participação é anônima e leva menos de 10 minutos.\n\nAcesse aqui: ${SHARE_LINK}`,
    emailSubject: `Convidamos você a participar: mapeamento de saúde no trabalho`,
    emailBody:    `Olá,\n\nEstamos realizando, em parceria com a Fluir, um mapeamento de saúde e clima no trabalho. Suas respostas são anônimas e nos ajudam a criar um ambiente melhor para todos.\n\nA pesquisa leva menos de 10 minutos. Acesse pelo link:\n${SHARE_LINK}\n\nObrigado pela participação!`,
    cartaz:       `Sua voz importa!\n\nEstamos mapeando a saúde e o clima no trabalho em parceria com a Fluir. Participe de forma anônima e ajude a construir um ambiente melhor.\n\nAcesse: ${SHARE_LINK}\nLeva menos de 10 minutos.`,
  },
  lembrete: {
    whatsapp:     `Olá! Ainda dá tempo de participar do nosso mapeamento de saúde no trabalho, realizado com a Fluir. Sua resposta é anônima e faz diferença para toda a equipe!\n\nAcesse aqui: ${SHARE_LINK}`,
    emailSubject: `Lembrete: ainda dá tempo de participar da pesquisa`,
    emailBody:    `Olá,\n\nPercebemos que você ainda não respondeu ao nosso mapeamento de saúde e clima no trabalho, realizado em parceria com a Fluir. Suas respostas são anônimas e muito importantes!\n\nAinda dá tempo — acesse:\n${SHARE_LINK}\n\nObrigado!`,
    cartaz:       `Ainda não respondeu?\n\nA pesquisa de saúde no trabalho ainda está aberta. Suas respostas são anônimas e essenciais para melhorarmos o ambiente de trabalho.\n\nAcesse: ${SHARE_LINK}`,
  },
  'reta-final': {
    whatsapp:     `Olá! Estamos nos últimos dias da pesquisa de saúde no trabalho e precisamos da sua resposta para atingirmos a meta. É rápido, anônimo e faz muita diferença!\n\nAcesse aqui: ${SHARE_LINK}`,
    emailSubject: `Últimos dias: não deixe de participar da pesquisa`,
    emailBody:    `Olá,\n\nEstamos nos últimos dias do nosso mapeamento de saúde e clima no trabalho (realizado com a Fluir) e ainda precisamos da sua resposta para atingirmos a meta.\n\nSua contribuição é anônima e garante que os resultados sejam válidos para toda a equipe.\n\nAcesse agora: ${SHARE_LINK}\n\nObrigado!`,
    cartaz:       `Últimos dias!\n\nA pesquisa de saúde no trabalho está encerrando em breve. Responda de forma anônima e ajude a atingirmos a meta de participação.\n\nAcesse: ${SHARE_LINK}`,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function daysLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function minExtendDate(currentEnd: string) {
  const d = new Date(currentEnd);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function addDays(isoDate: string, days: number) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CampaignStatus, {
  badgeVariant: 'success' | 'warning' | 'neutral';
  badgeLabel: string;
  barColor: string;
}> = {
  collecting: { badgeVariant: 'success',  badgeLabel: 'Em andamento',  barColor: 'bg-[var(--emerald-400)]' },
  paused:     { badgeVariant: 'warning',  badgeLabel: 'Pausada',    barColor: 'bg-amber-400'             },
  closed:     { badgeVariant: 'neutral',  badgeLabel: 'Encerrada',  barColor: 'bg-[var(--neutral-300)]'  },
};

// ─── Share dropdown ───────────────────────────────────────────────────────────

function ShareMenu({
  anchorEl,
  onClose,
  onCopyLink,
  onQrCode,
  onMaterials,
  copied,
}: {
  anchorEl: HTMLButtonElement;
  onClose: () => void;
  onCopyLink: () => void;
  onQrCode: () => void;
  onMaterials: () => void;
  copied: boolean;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const rect    = anchorEl.getBoundingClientRect();

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target) && !anchorEl.contains(target)) onClose();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [anchorEl, onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-56 rounded-xl shadow-lg border border-[var(--neutral-200)] bg-white overflow-hidden py-1"
      style={{ top: rect.bottom + 6, right: window.innerWidth - rect.right }}
    >
      <button
        onClick={() => { onCopyLink(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left text-[var(--neutral-700)] hover:bg-[var(--neutral-50)] transition-colors"
      >
        {copied
          ? <Check className="w-4 h-4 shrink-0 text-emerald-500" />
          : <Copy className="w-4 h-4 shrink-0 text-[var(--neutral-400)]" />}
        {copied ? 'Link copiado!' : 'Copiar link'}
      </button>
      <button
        onClick={() => { onQrCode(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left text-[var(--neutral-700)] hover:bg-[var(--neutral-50)] transition-colors"
      >
        <QrCode className="w-4 h-4 shrink-0 text-[var(--neutral-400)]" />
        Ver QR Code
      </button>
      <div className="my-1 border-t border-[var(--neutral-100)]" />
      <button
        onClick={() => { onMaterials(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left text-[var(--neutral-700)] hover:bg-[var(--neutral-50)] transition-colors"
      >
        <BookOpen className="w-4 h-4 shrink-0 text-[var(--neutral-400)]" />
        Textos prontos
      </button>
    </div>
  );
}

// ─── Manage dropdown ──────────────────────────────────────────────────────────

function ManageMenu({
  anchorEl,
  onClose,
  status,
  onExtend,
  onPause,
  onResume,
  onCloseEarly,
}: {
  anchorEl: HTMLButtonElement;
  onClose: () => void;
  status: CampaignStatus;
  onExtend: () => void;
  onPause: () => void;
  onResume: () => void;
  onCloseEarly: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const rect    = anchorEl.getBoundingClientRect();

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target) && !anchorEl.contains(target)) onClose();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [anchorEl, onClose]);

  const items = [
    { icon: CalendarPlus, label: 'Estender prazo',          action: onExtend,    destructive: false },
    status === 'collecting'
      ? { icon: Pause, label: 'Pausar',              action: onPause,     destructive: false }
      : { icon: Play,  label: 'Retomar',             action: onResume,    destructive: false },
    { icon: StopCircle, label: 'Encerrar antes do prazo',   action: onCloseEarly, destructive: true  },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-52 rounded-xl shadow-lg border border-[var(--neutral-200)] bg-white overflow-hidden py-1"
      style={{ top: rect.bottom + 6, right: window.innerWidth - rect.right }}
    >
      {items.map(({ icon: Icon, label, action, destructive }) => (
        <button
          key={label}
          onClick={() => { action(); onClose(); }}
          className={clsx(
            'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors',
            destructive
              ? 'text-red-600 hover:bg-red-50'
              : 'text-[var(--neutral-700)] hover:bg-[var(--neutral-50)]',
          )}
        >
          <Icon className={clsx('w-4 h-4 shrink-0', destructive ? 'text-red-400' : 'text-[var(--neutral-400)]')} />
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignDetailPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const isNew        = searchParams.get('ativada') === 'true';

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(isNew);
  const [status,          setStatus]          = useState<CampaignStatus>('collecting');
  const [endDate,         setEndDate]         = useState(MOCK_CAMPAIGN.endDate);
  const [openModal,       setOpenModal]       = useState<ActiveModal>(null);
  const [newEndDate,      setNewEndDate]      = useState('');
  const [copied,          setCopied]          = useState(false);
  const [manageAnchor,    setManageAnchor]    = useState<HTMLButtonElement | null>(null);
  const [shareAnchor,     setShareAnchor]     = useState<HTMLButtonElement | null>(null);
  const [pausedAt,        setPausedAt]        = useState<Date | null>(null);
  const [showMaterials,   setShowMaterials]   = useState(false);
  const [copiedMaterial,  setCopiedMaterial]  = useState<string | null>(null);
  const [materialMoment,  setMaterialMoment]  = useState<MaterialMoment>('convite');
  const [resumeStrategy,  setResumeStrategy]  = useState<'keep' | 'extend'>('keep');
  const [groupsOpen,      setGroupsOpen]      = useState(true);
  const [isEconomicGroup, setIsEconomicGroup] = useState(false);
  const [controlsDone,     setControlsDone]     = useState(false);
  const [responsibleDone,  setResponsibleDone]  = useState(false);
  const [observationsDone, setObservationsDone] = useState(false);
  const [cipaDone,         setCipaDone]         = useState(false);

  const close         = () => setOpenModal(null);
  const openManage    = (e: React.MouseEvent<HTMLButtonElement>) =>
    setManageAnchor(prev => prev ? null : e.currentTarget);
  const closeManage   = () => setManageAnchor(null);
  const openShare     = (e: React.MouseEvent<HTMLButtonElement>) =>
    setShareAnchor(prev => prev ? null : e.currentTarget);
  const closeShare    = () => setShareAnchor(null);

  useEffect(() => {
    if (isNew) {
      const url = new URL(window.location.href);
      url.searchParams.delete('ativada');
      window.history.replaceState({}, '', url.toString());
    }
  }, [isNew]);

  const pct        = Math.round((MOCK_CAMPAIGN.responses / MOCK_CAMPAIGN.totalWorkers) * 100);
  const remaining  = daysLeft(endDate);
  const cfg        = STATUS_CONFIG[status];
  const isValid    = pct >= 60;
  const barColor   = isValid ? 'bg-[var(--emerald-600)]' : 'bg-neutral-300';
  const pctColor   = isValid ? 'text-emerald-600' : 'text-[var(--neutral-500)]';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(SHARE_LINK).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMaterial = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedMaterial(id);
    setTimeout(() => setCopiedMaterial(null), 2000);
  };

  const daysPaused = pausedAt
    ? Math.max(1, Math.ceil((Date.now() - pausedAt.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const handlePause = () => {
    setPausedAt(new Date());
    setStatus('paused');
    close();
  };
  const handleResume = () => {
    if (resumeStrategy === 'extend') setEndDate(addDays(endDate, daysPaused));
    setPausedAt(null);
    setResumeStrategy('keep');
    setStatus('collecting');
    close();
  };
  const handleCloseEarly = () => { setStatus('closed'); close(); };
  const handleExtend    = () => {
    if (newEndDate) { setEndDate(newEndDate); setNewEndDate(''); }
    close();
  };

  // ── PGR wizard ───────────────────────────────────────────────────────────────
  const pgrSteps = ['Controles', 'Responsável', 'Observações', 'CIPA'];

  const pgrCompletedSteps = [
    ...(controlsDone     ? [1] : []),
    ...(responsibleDone  ? [2] : []),
    ...(observationsDone ? [3] : []),
    ...(cipaDone         ? [4] : []),
  ];

  const pgrAllDone     = pgrCompletedSteps.length === pgrSteps.length;
  const pgrCurrentStep = pgrAllDone ? pgrSteps.length : pgrCompletedSteps.length + 1;

  const PGR_STEP_HINTS: Record<number, string> = {
    1: 'Informe os controles de prevenção já adotados',
    2: 'Informe o responsável técnico pelo PGR',
    3: 'Observações adicionais para o inventário',
    4: 'Confirme o representante da CIPA',
  };

  return (
    <div className="flex overflow-hidden md:h-screen bg-[var(--surface-subtle)]">
      <AppSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 md:overflow-y-auto">

        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <header className="h-14 border-b border-[var(--border)] bg-white px-4 md:px-8 flex items-center gap-3 sticky top-0 z-20">
          <button
            className="p-2.5 -ml-2 md:hidden text-[var(--text-secondary)]"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <button
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors shrink-0"
            onClick={() => router.push('/campanhas')}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Campanhas
          </button>
          <span className="hidden sm:block text-[var(--neutral-300)]">/</span>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h1 className="hidden sm:block font-semibold text-[var(--text-primary)] text-sm truncate">
              {MOCK_CAMPAIGN.name}
            </h1>
            <Badge variant={cfg.badgeVariant} className="text-[10px] px-2 h-5 font-semibold shrink-0">
              {cfg.badgeLabel}
            </Badge>
          </div>
          {status !== 'closed' && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={openShare}
                className={clsx(
                  'inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-lg border transition-colors',
                  shareAnchor
                    ? 'border-[var(--neutral-300)] bg-[var(--neutral-100)] text-[var(--neutral-800)]'
                    : 'border-[var(--neutral-300)] text-[var(--neutral-700)] bg-white hover:bg-[var(--neutral-50)]',
                )}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>
              <button
                onClick={openManage}
                className={clsx(
                  'inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-lg border transition-colors',
                  manageAnchor
                    ? 'border-[var(--navy-400)] bg-[var(--navy-100)] text-[var(--navy-800)]'
                    : 'border-[var(--navy-300)] bg-[var(--navy-50)] text-[var(--navy-700)] hover:bg-[var(--navy-100)]',
                )}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gerenciar</span>
              </button>
            </div>
          )}
        </header>

        {/* ── Prototype switcher ───────────────────────────────────────────── */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 md:px-8 py-2 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 shrink-0">
            <Settings2 className="w-3.5 h-3.5" />
            Protótipo
          </div>
          <div className="h-3.5 w-px bg-amber-200 shrink-0" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-amber-700 whitespace-nowrap">Estado:</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as CampaignStatus)}
              className="text-xs text-amber-900 bg-white border border-amber-200 rounded-lg px-2.5 py-1 outline-none focus:border-amber-400 cursor-pointer font-medium"
            >
              <option value="collecting">Em andamento</option>
              <option value="paused">Pausada</option>
              <option value="closed">Encerrada</option>
            </select>
          </div>
          <div className="h-3.5 w-px bg-amber-200 shrink-0" />
          <label className="flex items-center gap-1.5 text-xs text-amber-700 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={isEconomicGroup}
              onChange={e => setIsEconomicGroup(e.target.checked)}
              className="accent-amber-600"
            />
            Grupo econômico
          </label>
          {status === 'closed' && (
            <>
              <div className="h-3.5 w-px bg-amber-200 shrink-0" />
              <label className="flex items-center gap-1.5 text-xs text-amber-700 cursor-pointer select-none whitespace-nowrap">
                <input type="checkbox" checked={controlsDone} onChange={e => setControlsDone(e.target.checked)} className="accent-amber-600" />
                Controles OK
              </label>
              <label className="flex items-center gap-1.5 text-xs text-amber-700 cursor-pointer select-none whitespace-nowrap">
                <input type="checkbox" checked={responsibleDone} onChange={e => setResponsibleDone(e.target.checked)} className="accent-amber-600" />
                Responsável OK
              </label>
              <label className="flex items-center gap-1.5 text-xs text-amber-700 cursor-pointer select-none whitespace-nowrap">
                <input type="checkbox" checked={observationsDone} onChange={e => setObservationsDone(e.target.checked)} className="accent-amber-600" />
                Observações OK
              </label>
              <label className="flex items-center gap-1.5 text-xs text-amber-700 cursor-pointer select-none whitespace-nowrap">
                <input type="checkbox" checked={cipaDone} onChange={e => setCipaDone(e.target.checked)} className="accent-amber-600" />
                CIPA OK
              </label>
            </>
          )}
        </div>

        {/* ── Banners ──────────────────────────────────────────────────────── */}
        {showSuccessBanner && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 md:px-8 py-3 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-900">Campanha ativada com sucesso!</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                O link de acesso foi gerado e pode ser compartilhado com os participantes.
              </p>
            </div>
            <button onClick={() => setShowSuccessBanner(false)} className="p-1 text-emerald-600 hover:text-emerald-800 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'paused' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 md:px-8 py-3 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
              <Pause className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900">Campanha pausada</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Novos respondentes não conseguem acessar o questionário enquanto a campanha estiver pausada.
              </p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 border-amber-300 text-amber-800 hover:bg-amber-100" onClick={() => setOpenModal('resume')}>
              Retomar
            </Button>
          </div>
        )}

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">

          {/* Campaign name — prominent on mobile, also visible on desktop */}
          <h2 className="text-xl font-bold text-[var(--neutral-900)] leading-tight">
            {MOCK_CAMPAIGN.name}
          </h2>

          {/* ── Closed: results CTA (hero) ───────────────────────────────────── */}
          {status === 'closed' && (
            <div className="rounded-2xl border-2 border-[var(--navy-200)] bg-[var(--navy-50)] p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--navy-100)] flex items-center justify-center shrink-0">
                <BarChart2 className="w-5 h-5 text-[var(--navy-700)]" />
              </div>
              <p className="flex-1 font-semibold text-[var(--navy-900)]">Relatório disponível</p>
              <Button variant="primary" size="sm" className="shrink-0">
                Ver relatório
              </Button>
            </div>
          )}

          {/* ── Closed: PGR wizard entry ──────────────────────────────────────── */}
          {status === 'closed' && (
            <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm p-5 space-y-4">

              {/* Title */}
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-[var(--neutral-900)]">Inventário de Riscos (PGR)</p>
                {pgrAllDone && (
                  <Badge variant="success" className="text-[10px] px-2 h-5 font-semibold shrink-0">Pronto</Badge>
                )}
              </div>

              {/* Step track */}
              <div className="space-y-2">
                <div className="flex items-end gap-1.5">
                  {pgrSteps.map((label, i) => {
                    const stepNum = i + 1;
                    const done    = pgrCompletedSteps.includes(stepNum);
                    const current = stepNum === pgrCurrentStep && !pgrAllDone;
                    return (
                      <div key={label} className="flex flex-col items-start flex-1 min-w-0 gap-1">
                        <span className={clsx(
                          'text-[10px] font-semibold text-[var(--navy-900)] leading-none whitespace-nowrap',
                          current ? 'opacity-100' : 'opacity-0 select-none pointer-events-none',
                        )}>
                          {label}
                        </span>
                        <div className="flex items-center w-full gap-1">
                          <div className={clsx(
                            'rounded-full shrink-0 transition-all',
                            current ? 'w-2.5 h-2.5' : 'w-2 h-2',
                            done    ? 'bg-[var(--emerald-500)]' :
                            current ? 'bg-[var(--navy-900)]'   :
                                      'bg-[var(--neutral-200)]',
                          )} />
                          {i < pgrSteps.length - 1 && (
                            <div className={clsx('h-px flex-1', done ? 'bg-[var(--emerald-200)]' : 'bg-[var(--neutral-200)]')} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs font-medium text-[var(--neutral-600)]">
                  {pgrAllDone ? 'Todas as etapas concluídas' : PGR_STEP_HINTS[pgrCurrentStep]}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-1 border-t border-[var(--neutral-100)] flex items-center justify-between gap-3">
                <p className="text-xs text-[var(--neutral-400)]">
                  {pgrCompletedSteps.length} de {pgrSteps.length} etapas concluídas
                </p>
                <Button
                  variant={pgrAllDone ? 'outline' : 'primary'}
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={() => router.push(pgrAllDone ? '/inventario/cp-1' : '/campanhas/1/inventario')}
                >
                  {pgrAllDone ? 'Ver documento' : 'Continuar'}
                  {!pgrAllDone && <ArrowRight className="w-3.5 h-3.5" />}
                </Button>
              </div>

            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className={clsx(
              'bg-white rounded-xl border border-[var(--neutral-200)] p-4 flex items-center justify-between gap-2 overflow-hidden',
              status === 'closed' && 'order-2 sm:order-none'
            )}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--neutral-400)] mb-1">Participação</p>
                <p className="text-3xl font-bold leading-none text-[var(--neutral-900)]">{pct}%</p>
                <p className="text-xs text-[var(--neutral-400)] mt-1">{MOCK_CAMPAIGN.responses} de {MOCK_CAMPAIGN.totalWorkers}</p>
              </div>
              <TrendingUp className="w-10 h-10 shrink-0 text-[var(--neutral-100)]" />
            </div>
            <div className={clsx(
              'bg-white rounded-xl border border-[var(--neutral-200)] p-4 flex items-center justify-between gap-2 overflow-hidden',
              status === 'closed' && 'order-3 sm:order-none'
            )}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--neutral-400)] mb-1">Responderam</p>
                <p className="text-3xl font-bold leading-none text-[var(--neutral-900)]">{MOCK_CAMPAIGN.responses}</p>
                <p className="text-xs text-[var(--neutral-400)] mt-1">{MOCK_CAMPAIGN.totalWorkers - MOCK_CAMPAIGN.responses} pendentes</p>
              </div>
              <Users className="w-10 h-10 shrink-0 text-[var(--neutral-100)]" />
            </div>
            <div className={clsx(
              'col-span-2 sm:col-span-1 rounded-xl border p-4 flex items-center justify-between gap-2 overflow-hidden',
              status === 'closed'
                ? 'order-1 sm:order-none bg-[var(--neutral-50)] border-[var(--neutral-300)]'
                : 'bg-white border-[var(--neutral-200)]'
            )}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--neutral-400)] mb-1">
                  {status === 'closed' ? 'Encerrada' : 'Encerra em'}
                </p>
                {status === 'closed' ? (
                  <>
                    <p className="text-xl font-bold leading-[1.875rem] text-[var(--neutral-900)]">{formatDate(endDate)}</p>
                    <p className="text-xs text-[var(--neutral-400)] mt-1">Início: {formatDate(MOCK_CAMPAIGN.startDate)}</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold leading-none text-[var(--neutral-900)]">{remaining}</p>
                    <p className="text-xs text-[var(--neutral-400)] mt-1">
                      {remaining === 1 ? 'dia' : 'dias'} · {formatDate(endDate)}
                    </p>
                  </>
                )}
              </div>
              <Clock className={clsx(
                'w-10 h-10 shrink-0',
                status === 'closed' ? 'text-[var(--neutral-200)]' : 'text-[var(--neutral-100)]'
              )} />
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--neutral-900)]">Progresso geral</p>
              <p className={clsx('text-sm font-bold', pctColor)}>{pct}%</p>
            </div>
            <div className="h-2.5 w-full rounded-full bg-[var(--neutral-100)] overflow-hidden">
              <div className={clsx('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--neutral-400)]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(MOCK_CAMPAIGN.startDate)} → {formatDate(endDate)}
              </span>
              <span>
                {status === 'closed'  ? 'Encerrada'          :
                 status === 'paused'  ? 'Campanha pausada'     :
                 remaining > 0        ? `${remaining} dias restantes` :
                                        'Encerra hoje'}
              </span>
            </div>
          </div>

          {/* Groups — accordion */}
          <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <button
                onClick={() => setGroupsOpen(o => !o)}
                className="flex items-center gap-2 group"
              >
                <ChevronDown className={clsx(
                  'w-4 h-4 text-[var(--neutral-400)] transition-transform duration-200',
                  groupsOpen ? 'rotate-180' : ''
                )} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--neutral-500)] group-hover:text-[var(--neutral-700)] transition-colors">
                  Progresso por grupo
                </span>
                <span className="text-[10px] text-[var(--neutral-400)]">
                  · {MOCK_CAMPAIGN.groups.length} grupos
                </span>
              </button>
            </div>
            <div className={clsx(
              'overflow-hidden transition-all duration-200',
              groupsOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            )}>
              <div className="divide-y divide-[var(--neutral-100)] border-t border-[var(--neutral-100)]">
                {MOCK_CAMPAIGN.groups.map(group => {
                  const reachedMinimum = group.responses / group.workers >= 0.5;
                  return (
                    <div key={group.name} className="px-5 py-3.5 flex items-center justify-between gap-4">
                      <span className="text-sm text-[var(--neutral-800)]">{group.name}</span>
                      {reachedMinimum ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mínimo atingido
                        </span>
                      ) : status === 'closed' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shrink-0">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Insuficiente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--neutral-500)] bg-[var(--neutral-50)] border border-[var(--neutral-200)] px-2.5 py-1 rounded-full shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          Aguardando respostas
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>



        </div>
      </main>

      {/* ── Share dropdown ──────────────────────────────────────────────────── */}
      {shareAnchor && (
        <ShareMenu
          anchorEl={shareAnchor}
          onClose={closeShare}
          copied={copied}
          onCopyLink={handleCopyLink}
          onQrCode={() => setOpenModal('qrcode')}
          onMaterials={() => { setShowMaterials(true); closeShare(); }}
        />
      )}

      {/* ── Manage dropdown ─────────────────────────────────────────────────── */}
      {manageAnchor && (
        <ManageMenu
          anchorEl={manageAnchor}
          onClose={closeManage}
          status={status}
          onExtend={() => setOpenModal('extend')}
          onPause={() => setOpenModal('pause')}
          onResume={() => setOpenModal('resume')}
          onCloseEarly={() => setOpenModal('close-early')}
        />
      )}

      {/* ── Modals ──────────────────────────────────────────────────────────── */}

      {/* QR Code */}
      <Modal
        isOpen={openModal === 'qrcode'}
        onClose={close}
        title="QR Code da campanha"
        size="sm"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" size="md" className="flex-1 justify-center gap-2" onClick={() => handleCopyMaterial('qr-img', '')}>
              {copiedMaterial === 'qr-img' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copiedMaterial === 'qr-img' ? 'Copiado!' : 'Copiar imagem'}
            </Button>
            <Button variant="primary" size="md" className="flex-1 justify-center gap-2">
              <Download className="w-4 h-4" />
              Baixar
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-52 h-52 bg-white border-2 border-[var(--neutral-900)] rounded-xl flex items-center justify-center">
            <QrCode className="w-40 h-40 text-[var(--neutral-900)]" />
          </div>
          <div className="w-full space-y-2">
            <p className="text-xs text-center text-[var(--neutral-500)]">
              Fixe em locais visíveis da empresa para facilitar o acesso dos participantes.
            </p>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--neutral-400)]">Link da campanha</p>
              <div className="flex items-center gap-2 p-2.5 bg-[var(--neutral-50)] rounded-lg border border-[var(--neutral-200)]">
                <p className="text-xs text-[var(--neutral-500)] flex-1 truncate font-mono">{SHARE_LINK}</p>
                <button
                  onClick={handleCopyLink}
                  className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[var(--navy-700)] hover:text-[var(--navy-900)] transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Enviar lembrete */}
      <ConfirmModal
        isOpen={openModal === 'remind'}
        onClose={close}
        onConfirm={close}
        variant="default"
        title="Enviar lembrete"
        description={`${MOCK_CAMPAIGN.totalWorkers - MOCK_CAMPAIGN.responses} trabalhadores ainda não responderam. Um lembrete será enviado para todos eles.`}
        confirmLabel="Enviar lembrete"
        cancelLabel="Cancelar"
      />

      {/* Estender prazo */}
      <Modal
        isOpen={openModal === 'extend'}
        onClose={close}
        title="Estender prazo"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={close}>Cancelar</Button>
            <Button variant="primary" onClick={handleExtend} disabled={!newEndDate}>
              Confirmar extensão
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[var(--neutral-50)] border border-[var(--neutral-200)]">
            <span className="text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wide">Prazo atual de encerramento</span>
            <span className="text-sm font-bold text-[var(--neutral-900)]">{formatDate(endDate)}</span>
          </div>
          <input
            type="date"
            min={minExtendDate(endDate)}
            value={newEndDate}
            onChange={e => setNewEndDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm text-[var(--neutral-900)] outline-none focus:border-[var(--navy-500)] focus:ring-2 focus:ring-[var(--navy-100)] transition-all"
          />
        </div>
      </Modal>

      {/* Pausar */}
      <Modal
        isOpen={openModal === 'pause'}
        onClose={close}
        title="Pausar campanha"
        variant="warning"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={close}>Cancelar</Button>
            <Button variant="primary" onClick={handlePause}>Pausar campanha</Button>
          </div>
        }
      >
        <ul className="space-y-2.5">
          {[
            'Os participantes não conseguirão acessar o questionário durante a pausa.',
            'Os dados já coletados são preservados.',
            'Você pode retomar a campanha a qualquer momento.',
            'Ao retomar, você escolhe se deseja compensar os dias pausados ou manter a data original.',
          ].map(text => (
            <li key={text} className="flex items-start gap-2.5 text-sm text-[var(--neutral-700)]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </Modal>

      {/* Retomar */}
      <Modal
        isOpen={openModal === 'resume'}
        onClose={close}
        title="Retomar campanha"
        description="Como a campanha deve continuar após a pausa?"
        variant="default"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={close}>Cancelar</Button>
            <Button variant="primary" onClick={handleResume}>Retomar campanha</Button>
          </div>
        }
      >
        <div className="space-y-2.5">
          {[
            {
              id: 'keep',
              label: 'Manter data original',
              detail: `A campanha encerra em ${formatDate(endDate)}, como planejado.`,
            },
            {
              id: 'extend',
              label: 'Compensar os dias pausados',
              detail: `Adiciona ${daysPaused} dia${daysPaused !== 1 ? 's' : ''} · nova data: ${formatDate(addDays(endDate, daysPaused))}.`,
            },
          ].map(opt => (
            <label
              key={opt.id}
              onClick={() => setResumeStrategy(opt.id as 'keep' | 'extend')}
              className={clsx(
                'flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors',
                resumeStrategy === opt.id
                  ? 'border-[var(--navy-500)] bg-[var(--navy-50,#f0f4ff)]'
                  : 'border-[var(--neutral-200)] hover:border-[var(--neutral-300)]',
              )}
            >
              <div className={clsx(
                'mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                resumeStrategy === opt.id ? 'border-[var(--navy-600)]' : 'border-[var(--neutral-300)]',
              )}>
                {resumeStrategy === opt.id && (
                  <div className="w-2 h-2 rounded-full bg-[var(--navy-600)]" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--neutral-900)]">{opt.label}</p>
                <p className="text-xs text-[var(--neutral-500)] mt-0.5">{opt.detail}</p>
              </div>
            </label>
          ))}
        </div>
      </Modal>

      {/* ── Materiais drawer ────────────────────────────────────────────────── */}
      <Drawer
        open={showMaterials}
        onClose={() => setShowMaterials(false)}
        title="Textos prontos"
        subtitle="Textos para copiar e enviar"
        width="md"
        stickyContent={
          <div className="flex gap-2">
            {(Object.keys(MOMENT_LABELS) as MaterialMoment[]).map(m => (
              <button
                key={m}
                onClick={() => setMaterialMoment(m)}
                className={clsx(
                  'h-7 px-3 rounded-full text-xs font-semibold transition-colors',
                  materialMoment === m
                    ? 'bg-[var(--navy-900)] text-white'
                    : 'bg-[var(--neutral-100)] text-[var(--neutral-600)] hover:bg-[var(--neutral-200)]',
                )}
              >
                {MOMENT_LABELS[m]}
              </button>
            ))}
          </div>
        }
      >
        {(() => {
          const mat = MATERIALS[materialMoment];
          const CopyBtn = ({ id, text }: { id: string; text: string }) => (
            <button
              onClick={() => handleCopyMaterial(id, text)}
              className="flex items-center gap-1 text-xs font-semibold text-[var(--navy-700)] hover:text-[var(--navy-900)] transition-colors shrink-0"
            >
              {copiedMaterial === id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copiedMaterial === id ? 'Copiado!' : 'Copiar'}
            </button>
          );
          const ChannelBlock = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) => (
            <div className="rounded-xl border border-[var(--neutral-200)] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--neutral-50)] border-b border-[var(--neutral-200)]">
                <Icon className="w-3.5 h-3.5 text-[var(--neutral-400)] shrink-0" />
                <span className="text-xs font-semibold text-[var(--neutral-600)]">{label}</span>
              </div>
              {children}
            </div>
          );
          return (
            <div className="space-y-4">
              {/* WhatsApp */}
              <ChannelBlock icon={MessageCircle} label="WhatsApp">
                <div className="px-4 py-3 space-y-2">
                  <p className="text-sm text-[var(--neutral-700)] whitespace-pre-line leading-relaxed">{mat.whatsapp}</p>
                  <div className="flex justify-end"><CopyBtn id={`${materialMoment}-wa`} text={mat.whatsapp} /></div>
                </div>
              </ChannelBlock>

              {/* E-mail */}
              <ChannelBlock icon={Mail} label="E-mail">
                <div className="divide-y divide-[var(--neutral-100)]">
                  <div className="px-4 py-3 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--neutral-400)]">Assunto</p>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-[var(--neutral-700)] leading-relaxed">{mat.emailSubject}</p>
                      <CopyBtn id={`${materialMoment}-es`} text={mat.emailSubject} />
                    </div>
                  </div>
                  <div className="px-4 py-3 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--neutral-400)]">Corpo</p>
                    <p className="text-sm text-[var(--neutral-700)] whitespace-pre-line leading-relaxed">{mat.emailBody}</p>
                    <div className="flex justify-end"><CopyBtn id={`${materialMoment}-eb`} text={mat.emailBody} /></div>
                  </div>
                </div>
              </ChannelBlock>

              {/* Cartaz */}
              <ChannelBlock icon={FileText} label="Cartaz / aviso interno">
                <div className="px-4 py-3 space-y-2">
                  <p className="text-sm text-[var(--neutral-700)] whitespace-pre-line leading-relaxed">{mat.cartaz}</p>
                  <div className="flex justify-end"><CopyBtn id={`${materialMoment}-ct`} text={mat.cartaz} /></div>
                </div>
              </ChannelBlock>
              <Button variant="outline" size="md" className="w-full justify-center gap-2" onClick={() => router.push('/materiais')}>
                <BookOpen className="w-4 h-4" />
                Ver todos os materiais
              </Button>
            </div>
          );
        })()}
      </Drawer>

      {/* Encerrar antes do prazo */}
      <Modal
        isOpen={openModal === 'close-early'}
        onClose={close}
        title="Encerrar antes do prazo"
        variant="warning"
        size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={close}>Cancelar</Button>
            <Button variant="destructive" onClick={handleCloseEarly}>Encerrar campanha</Button>
          </div>
        }
      >
        <ul className="space-y-2.5">
          {[
            'A campanha será finalizada imediatamente.',
            'Os dados coletados até agora são preservados.',
            'Os participantes perderão o acesso ao questionário.',
            'Esta ação não pode ser desfeita.',
          ].map(text => (
            <li key={text} className="flex items-start gap-2.5 text-sm text-[var(--neutral-700)]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </Modal>

    </div>
  );
}
