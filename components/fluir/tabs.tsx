'use client';

import { HTMLAttributes, forwardRef, ReactNode, useState, createContext, useContext } from 'react';
import { clsx } from 'clsx';

// --- Context ---
interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: 'underline' | 'contained';
}

const TabsContext = createContext<TabsContextType>({ activeTab: '', setActiveTab: () => {}, variant: 'underline' });

// --- Tabs Root ---
interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'underline' | 'contained';
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultTab = '', activeTab: controlledTab, onTabChange, variant = 'underline', className, children, ...props }, ref) => {
    const [internalTab, setInternalTab] = useState(defaultTab);
    const activeTab = controlledTab ?? internalTab;
    const setActiveTab = (id: string) => {
      setInternalTab(id);
      onTabChange?.(id);
    };

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
        <div ref={ref} className={clsx('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

// --- TabList ---
interface TabListProps extends HTMLAttributes<HTMLDivElement> {}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = useContext(TabsContext);

    return (
      <div
        ref={ref}
        role="tablist"
        className={clsx(
          'flex',
          variant === 'underline' && 'border-b border-[var(--neutral-200)] gap-0',
          variant === 'contained' && 'bg-[var(--neutral-100)] rounded-lg p-1 gap-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabList.displayName = 'TabList';

// --- Tab ---
interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  tabId: string;
  count?: number;
  icon?: ReactNode;
  disabled?: boolean;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ tabId, count, icon, disabled, className, children, ...props }, ref) => {
    const { activeTab, setActiveTab, variant } = useContext(TabsContext);
    const isActive = activeTab === tabId;

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        onClick={() => !disabled && setActiveTab(tabId)}
        disabled={disabled}
        className={clsx(
          'inline-flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap',
          variant === 'underline' && [
            'px-4 py-2.5 border-b-2 -mb-px',
            isActive
              ? 'border-[var(--navy-900)] text-[var(--navy-900)]'
              : 'border-transparent text-[var(--neutral-500)] hover:text-[var(--neutral-700)] hover:border-[var(--neutral-300)]',
          ],
          variant === 'contained' && [
            'px-3.5 py-2 rounded-md',
            isActive
              ? 'bg-white text-[var(--navy-900)] shadow-sm'
              : 'text-[var(--neutral-600)] hover:text-[var(--neutral-900)]',
          ],
          disabled && 'opacity-40 pointer-events-none',
          className
        )}
        {...props}
      >
        {icon}
        {children}
        {count !== undefined && (
          <span className={clsx(
            'min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[11px] font-semibold px-1.5',
            isActive
              ? 'bg-[var(--navy-100)] text-[var(--navy-900)]'
              : 'bg-[var(--neutral-200)] text-[var(--neutral-600)]'
          )}>
            {count}
          </span>
        )}
      </button>
    );
  }
);

Tab.displayName = 'Tab';

// --- TabPanel ---
interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  tabId: string;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ tabId, className, children, ...props }, ref) => {
    const { activeTab } = useContext(TabsContext);

    if (activeTab !== tabId) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={clsx('mt-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabPanel.displayName = 'TabPanel';