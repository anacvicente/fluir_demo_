'use client';

import { HTMLAttributes, forwardRef, ReactNode, createContext, useContext, useState } from 'react';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';

// --- Context ---
interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({ collapsed: false, setCollapsed: () => {} });

function useSidebar() {
  return useContext(SidebarContext);
}

// --- Sidebar Root ---
interface SidebarProps extends HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  logo?: ReactNode;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ collapsed: controlledCollapsed, onCollapsedChange, logo, mobileOpen = false, onMobileClose, className, children, ...props }, ref) => {
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const collapsed = controlledCollapsed ?? internalCollapsed;
    const setCollapsed = onCollapsedChange ?? setInternalCollapsed;
    // When mobile overlay is open, always show expanded
    const effectiveCollapsed = mobileOpen ? false : collapsed;

    return (
      <SidebarContext.Provider value={{ collapsed: effectiveCollapsed, setCollapsed }}>
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onMobileClose}
          />
        )}
        <aside
          ref={ref}
          className={clsx(
            'h-screen flex flex-col bg-[var(--navy-900)] text-white transition-all duration-300 flex-shrink-0 overflow-hidden',
            mobileOpen
              ? 'fixed inset-y-0 left-0 z-50 flex w-[240px]'
              : 'hidden md:flex',
            !mobileOpen && (collapsed ? 'md:w-[72px]' : 'md:w-[240px]'),
            className
          )}
          {...props}
        >
          {/* Header / Logo */}
          <div className={clsx(
            'flex items-center h-16 border-b border-white/10 flex-shrink-0',
            collapsed ? 'justify-center px-2' : 'px-5'
          )}>
            {collapsed ? (
              logo && (
                <button
                  onClick={() => setCollapsed(false)}
                  className="mx-auto rounded-md hover:opacity-80 transition-opacity"
                  aria-label="Expandir menu"
                >
                  {logo}
                </button>
              )
            ) : (
              <>
                {logo && (
                  <div className="flex-1 transition-all">
                    {logo}
                  </div>
                )}
                <button
                  onClick={() => setCollapsed(true)}
                  className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
                  aria-label="Recolher menu"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden py-4">
            {children}
          </div>
        </aside>
      </SidebarContext.Provider>
    );
  }
);

Sidebar.displayName = 'Sidebar';

// --- SidebarNav (grupo de itens) ---
interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  label?: string;
}

export const SidebarNav = forwardRef<HTMLElement, SidebarNavProps>(
  ({ label, className, children, ...props }, ref) => {
    const { collapsed } = useSidebar();

    return (
      <nav ref={ref} className={clsx('px-3 space-y-1', className)} {...props}>
        {label && !collapsed && (
          <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
            {label}
          </div>
        )}
        {children}
      </nav>
    );
  }
);

SidebarNav.displayName = 'SidebarNav';

// --- SidebarItem ---
interface SidebarItemProps extends HTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  label: string;
  active?: boolean;
  badge?: string | number;
  badgeVariant?: 'default' | 'accent' | 'warning' | 'error';
  disabled?: boolean;
  onClick?: () => void;
}

export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ icon: Icon, label, active, badge, badgeVariant = 'default', disabled, className, onClick, ...props }, ref) => {
    const { collapsed } = useSidebar();

    const badgeColors = {
      default: 'bg-white/20 text-white',
      accent: 'bg-[var(--emerald-600)] text-white',
      warning: 'bg-amber-500 text-white',
      error: 'bg-red-500 text-white'
    };

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          'flex items-center gap-3 w-full rounded-lg text-sm font-medium transition-all relative group',
          collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
          active
            ? 'bg-white/15 text-white'
            : 'text-white/70 hover:text-white hover:bg-white/5',
          disabled && 'opacity-40 pointer-events-none',
          className
        )}
        title={collapsed ? label : undefined}
        {...props}
      >
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        {!collapsed && <span className="flex-1 text-left truncate">{label}</span>}
        {badge !== undefined && badge !== null && (
          collapsed ? (
            <span className={clsx(
              'absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold px-1',
              badgeColors[badgeVariant]
            )}>
              {badge}
            </span>
          ) : (
            <span className={clsx(
              'min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[11px] font-bold px-1.5',
              badgeColors[badgeVariant]
            )}>
              {badge}
            </span>
          )
        )}

        {/* Tooltip when collapsed */}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[var(--neutral-900)] text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
            {label}
          </div>
        )}
      </button>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';

// --- SidebarSpacer (empurra itens pro bottom) ---
export function SidebarSpacer() {
  return <div className="flex-1" />;
}

// --- SidebarDivider ---
export function SidebarDivider() {
  return <div className="mx-3 my-3 border-t border-white/10" />;
}