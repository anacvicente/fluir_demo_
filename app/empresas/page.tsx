'use client';

import { useState } from 'react';
import { Plus, Menu } from 'lucide-react';
import { AppSidebar } from '@/components/fluir/app-sidebar';
import { Button } from '@/components/fluir/button';
import { Badge } from '@/components/fluir/badge';
import { Input } from '@/components/fluir/input';
import { EmptyState } from '@/components/fluir/empty-state';
import { CompanyBadge } from '@/components/fluir/avatar';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  plan: string;
  status: 'active' | 'inactive' | 'trial';
  campaigns: number;
}

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Petroquímica Nacional S.A.', cnpj: '12.345.678/0001-90', plan: 'Enterprise', status: 'active', campaigns: 4 },
  { id: '2', name: 'Distribuidora Alfa Ltda.', cnpj: '23.456.789/0001-01', plan: 'Pro', status: 'active', campaigns: 2 },
  { id: '3', name: 'Construtora Horizonte', cnpj: '34.567.890/0001-12', plan: 'Pro', status: 'trial', campaigns: 1 },
  { id: '4', name: 'Grupo Varejo BR', cnpj: '45.678.901/0001-23', plan: 'Enterprise', status: 'active', campaigns: 7 },
  { id: '5', name: 'Agro Soluções ME', cnpj: '56.789.012/0001-34', plan: 'Starter', status: 'inactive', campaigns: 0 },
];

const STATUS_LABELS: Record<Company['status'], string> = {
  active: 'Ativa',
  inactive: 'Inativa',
  trial: 'Trial',
};

const STATUS_VARIANTS: Record<Company['status'], 'success' | 'neutral' | 'warning'> = {
  active: 'success',
  inactive: 'neutral',
  trial: 'warning',
};

export default function EmpresasPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = MOCK_COMPANIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.cnpj.includes(search)
  );

  return (
    <div className="flex overflow-hidden md:h-screen bg-[var(--surface-subtle)]">
      <AppSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 md:overflow-y-auto relative">
        {/* Header */}
        <header className="h-16 border-b border-[var(--border)] bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="p-2.5 -ml-2 md:hidden text-[var(--text-secondary)]"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-[var(--text-primary)] text-xl">Empresas</h1>
            <Badge variant="neutral">{MOCK_COMPANIES.length}</Badge>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert('Criar nova empresa')}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Empresa</span>
          </Button>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          {/* Search */}
          <div className="mb-6 max-w-sm">
            <Input
              placeholder="Buscar por nome ou CNPJ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <EmptyState
              variant="no-results"
              title="Nenhuma empresa encontrada"
              description="Tente ajustar o filtro ou crie uma nova empresa."
              action={{
                label: 'Nova Empresa',
                onClick: () => alert('Criar nova empresa'),
              }}
            />
          ) : (
            <div className="bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-[var(--neutral-100)] bg-[var(--neutral-50)]">
                <span className="text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wide">Empresa</span>
                <span className="text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wide hidden md:block">Plano</span>
                <span className="text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wide hidden md:block">Campanhas</span>
                <span className="text-xs font-semibold text-[var(--neutral-500)] uppercase tracking-wide">Status</span>
              </div>

              {/* Rows */}
              {filtered.map((company) => (
                <div
                  key={company.id}
                  className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-[var(--neutral-50)] cursor-pointer transition-colors border-b border-[var(--neutral-100)] last:border-b-0"
                  onClick={() => alert(`Abrir empresa: ${company.name}`)}
                >
                  <CompanyBadge
                    name={company.name}
                    subtitle={company.cnpj}
                    variant="minimal"
                  />
                  <span className="text-sm text-[var(--neutral-600)] hidden md:block whitespace-nowrap">
                    {company.plan}
                  </span>
                  <span className="text-sm text-[var(--neutral-600)] hidden md:block text-center">
                    {company.campaigns}
                  </span>
                  <Badge variant={STATUS_VARIANTS[company.status]}>
                    {STATUS_LABELS[company.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
