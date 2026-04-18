'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, ClipboardList, ClipboardCheck,
  ShieldAlert, BookOpen, User, Settings, HelpCircle,
  Zap, LogOut, ChevronsUpDown,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Sidebar, SidebarNav, SidebarItem, SidebarSpacer, SidebarDivider } from './sidebar';
import { FluirLogo } from './logo';

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Painel',       href: '/' },
  { icon: Building2,       label: 'Empresas',     href: '/empresas' },
  { icon: ClipboardList,   label: 'Campanhas',    href: '/campanhas' },
  { icon: ClipboardCheck,  label: 'Questionário', href: '/questionario', newTab: true },
  { icon: ShieldAlert,     label: 'Inventário + Plano', href: '/inventario' },
  { icon: BookOpen,        label: 'Materiais',    href: '/materiais' },
];

// ─── Account menu sections ────────────────────────────────────────────────────

const MENU_SECTIONS = [
  [
    { icon: User,       label: 'Minha conta'         },
    { icon: Settings,   label: 'Configurações'        },
    { icon: HelpCircle, label: 'Ajuda e suporte'      },
  ],
  [
    { icon: Zap,    label: 'Fazer upgrade do plano' },
  ],
  [
    { icon: LogOut, label: 'Sair' },
  ],
];

// ─── Account popover ──────────────────────────────────────────────────────────

function AccountMenu({ anchorEl, onClose }: { anchorEl: HTMLButtonElement; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const rect    = anchorEl.getBoundingClientRect();

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        !anchorEl.contains(target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [anchorEl, onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[200] w-56 rounded-xl shadow-2xl border border-white/10 overflow-hidden py-1"
      style={{
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
        background: '#2a2435',
      }}
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-white/10">
        <p className="text-xs font-semibold text-white/90 truncate">Empresa Teste</p>
        <p className="text-[11px] text-white/40 truncate mt-0.5">empresa@fluir.vc</p>
      </div>

      {/* Sections */}
      {MENU_SECTIONS.map((section, si) => (
        <div key={si}>
          {si > 0 && <div className="my-1 border-t border-white/10" />}
          {section.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors text-left"
            >
              <Icon className="w-4 h-4 shrink-0 text-white/35" />
              {label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── App sidebar ──────────────────────────────────────────────────────────────

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onBeforeNavigate?: (href: string) => boolean;
}

export function AppSidebar({ mobileOpen = false, onMobileClose, onBeforeNavigate }: AppSidebarProps) {
  const [collapsed,   setCollapsed]   = useState(false);
  const [menuAnchor,  setMenuAnchor]  = useState<HTMLButtonElement | null>(null);
  const router   = useRouter();
  const pathname = usePathname();

  const effectiveCollapsed = !mobileOpen && collapsed;

  const navigate = (href: string, newTab?: boolean) => {
    if (newTab) { window.open(href, '_blank'); return; }
    if (onBeforeNavigate && onBeforeNavigate(href) === false) return;
    router.push(href);
  };

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(prev => (prev ? null : e.currentTarget));
  };

  return (
    <>
      <Sidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={onMobileClose}
        logo={
          <FluirLogo
            variant="white"
            iconOnly={collapsed}
            height={collapsed ? 32 : 30}
          />
        }
      >
        <SidebarNav label="Principal">
          {NAV_ITEMS.map(({ icon, label, href, newTab }) => (
            <SidebarItem
              key={label}
              icon={icon}
              label={label}
              active={!newTab && (href === '/' ? pathname === href : pathname.startsWith(href))}
              onClick={() => navigate(href, newTab)}
            />
          ))}
        </SidebarNav>

        <SidebarSpacer />
        <SidebarDivider />

        {/* Account button */}
        <div className="px-3 pb-3">
          <button
            onClick={toggleMenu}
            className={clsx(
              'flex items-center w-full rounded-lg transition-all',
              effectiveCollapsed ? 'justify-center px-2 py-2' : 'gap-2.5 px-2.5 py-2',
              menuAnchor
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5',
            )}
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white shrink-0 ring-1 ring-white/20">
              E
            </div>

            {!effectiveCollapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white/90 truncate leading-tight">Empresa Teste</p>
                  <p className="text-[11px] text-white/40 truncate leading-tight">empresa@fluir.vc</p>
                </div>
                <ChevronsUpDown className="w-3.5 h-3.5 text-white/30 shrink-0" />
              </>
            )}
          </button>
        </div>
      </Sidebar>

      {/* Popover — rendered outside sidebar to escape overflow:hidden */}
      {menuAnchor && (
        <AccountMenu anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)} />
      )}
    </>
  );
}
