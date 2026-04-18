'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import {
  FileDown, Info, Users, ArrowRight, AlertTriangle,
  CheckCircle2, RefreshCw, FileText, ShieldCheck, Search,
  Upload, Layers, Building2, RotateCcw, ClipboardList, Fingerprint
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../card';
import { Button } from '../button';
import { Alert } from '../alert';
import { Modal } from '../modal';

type ScreenState = 'idle' | 'processing' | 'warning' | 'valid';

interface Step1Props {
  onNext: () => void;
}

export default function Step1Participants({ onNext }: Step1Props) {
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [showExampleModal, setShowExampleModal] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadTimestamp, setUploadTimestamp] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screenState === 'warning' || screenState === 'valid') {
      setTimeout(() => summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [screenState]);

  const handleFileUpload = () => {
    setFileName('base-participantes.csv');
    setUploadTimestamp(new Date().toLocaleString('pt-BR'));
    setScreenState('processing');
    setShowIntro(false);
    setTimeout(() => setScreenState('warning'), 2500);
  };

  const resetUpload = () => {
    setScreenState('idle');
    setFileName(null);
  };

  return (
    <div className="space-y-6">
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--neutral-900)] mb-2">
          Enviar base de participantes
        </h2>
        {showIntro && (
          <Alert
            variant="info"
            title="Instruções da Etapa"
            className="mb-6"
            dismissible
            onDismiss={() => setShowIntro(false)}
          >
            <div className="space-y-4">
              <div>
                <p className="font-bold mb-2 text-sm">Nesta etapa, você envia o arquivo que define:</p>
                <ul className="list-disc list-inside space-y-1 ml-1 text-sm opacity-90">
                  <li>quem poderá responder à campanha</li>
                  <li>como os trabalhadores serão organizados nos resultados por grupo</li>
                </ul>
              </div>
              <div className="pt-3 border-t border-[var(--navy-200)]">
                <p className="font-bold mb-2 text-sm">Regras do Arquivo</p>
                <ul className="list-disc list-inside space-y-1.5 text-xs opacity-80 ml-1">
                  <li>O arquivo deve estar no formato .CSV.</li>
                  <li>A primeira linha deve ser idêntica ao exemplo disponível abaixo.</li>
                  <li>Grupos com menos de 5 trabalhadores serão sinalizados para reagrupamento, garantindo anonimato (NR-1 e LGPD).</li>
                </ul>
              </div>
            </div>
          </Alert>
        )}
      </section>

      <div className="flex flex-wrap gap-2 md:gap-4">
        <Button
          variant="outline"
          size="sm"
          className={clsx('text-xs md:text-sm flex-1 sm:flex-none transition-all', showIntro ? 'bg-[var(--navy-100)]' : 'bg-white')}
          onClick={() => setShowIntro(!showIntro)}
        >
          <Info className="w-4 h-4" />
          <span className="truncate">Instruções</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs md:text-sm flex-1 sm:flex-none bg-white"
          onClick={() => setShowExampleModal(true)}
        >
          <Search className="w-4 h-4" />
          <span className="truncate">Exemplo</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={clsx('border-t-4 transition-all duration-300 h-full', screenState !== 'idle' ? 'border-t-[var(--emerald-500)]' : 'border-t-[var(--navy-500)]')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upload da Base</CardTitle>
            <CardDescription className="text-xs">Selecione o arquivo CSV dos trabalhadores da empresa</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {screenState === 'idle' ? (
              <div
                className="relative border-2 border-dashed rounded-lg transition-all border-[var(--neutral-300)] bg-white hover:border-[var(--neutral-400)] cursor-pointer p-8"
                onClick={handleFileUpload}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="rounded-full p-3 bg-[var(--neutral-100)]">
                    <Upload className="w-6 h-6 text-[var(--neutral-400)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-700)]">Clique para simular o envio</p>
                    <p className="text-xs text-[var(--neutral-500)] mt-1">CSV • Simulação sem arquivo real</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-[var(--neutral-50)] rounded-lg border border-[var(--neutral-200)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-white rounded-md shadow-sm shrink-0">
                        <FileText className="w-5 h-5 text-[var(--navy-600)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-[var(--neutral-500)] uppercase tracking-wider mb-0.5">Base enviada</p>
                        <p className="text-sm font-semibold text-[var(--neutral-900)] truncate">{fileName}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={resetUpload} className="text-xs h-8 px-2 shrink-0">Alterar</Button>
                  </div>
                  {uploadTimestamp && (
                    <div className="mt-3 pt-3 border-t border-[var(--neutral-200)]">
                      <p className="text-[11px] text-[var(--neutral-500)] font-medium">Enviado em</p>
                      <p className="text-sm font-semibold text-[var(--neutral-700)] mt-0.5">{uploadTimestamp}</p>
                    </div>
                  )}
                </div>
                {screenState === 'processing' && (
                  <div className="flex items-center gap-3 p-3 bg-[var(--emerald-50)] rounded-lg border border-[var(--emerald-100)]">
                    <RefreshCw className="w-4 h-4 text-[var(--emerald-500)] animate-spin" />
                    <span className="text-sm font-medium text-[var(--emerald-700)]">Processando arquivo...</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={clsx('border-t-4 transition-all duration-300 h-full', screenState === 'valid' ? 'border-t-[var(--emerald-600)]' : screenState === 'warning' ? 'border-t-amber-500' : 'border-t-[var(--neutral-300)]')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Leitura e Validação</CardTitle>
            <CardDescription className="text-xs">Status do processamento dos dados</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col items-center justify-center min-h-[160px]">
            {screenState === 'idle' && (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[var(--neutral-100)] rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-[var(--neutral-400)]" />
                </div>
                <p className="text-[var(--neutral-500)] text-sm font-medium">Envie o arquivo para leitura</p>
              </div>
            )}
            {screenState === 'processing' && (
              <div className="text-center space-y-4 w-full">
                <div className="relative w-16 h-16 mx-auto">
                  <RefreshCw className="w-16 h-16 text-[var(--emerald-500)] animate-spin opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[var(--emerald-500)]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-base">Analisando estrutura...</h3>
                  <div className="w-full bg-[var(--neutral-100)] h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[var(--emerald-500)] h-full w-2/3 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            )}
            {(screenState === 'warning' || screenState === 'valid') && (
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 p-2.5 bg-[var(--neutral-50)] rounded-lg border border-[var(--neutral-100)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--emerald-600)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--neutral-700)]">Recebimento da base concluído</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-[var(--neutral-50)] rounded-lg border border-[var(--neutral-100)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--emerald-600)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--neutral-700)]">Leitura da estrutura finalizada</span>
                </div>
                {screenState === 'warning' ? (
                  <div className="flex flex-col gap-2 p-3 bg-[var(--neutral-50)] rounded-lg border border-amber-400">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" strokeWidth={1.5} />
                      <span className="text-sm font-bold text-[var(--neutral-900)]">Grupos que precisam de ajuste</span>
                    </div>
                    <p className="text-xs text-[var(--neutral-500)] ml-6">3 grupos abaixo do mínimo — ajuste obrigatório para continuar.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1 ml-6 bg-white text-xs h-7 self-start"
                      onClick={onNext}
                    >
                      Revisar grupos
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-2.5 bg-[var(--emerald-50)] rounded-lg border border-[var(--emerald-100)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--emerald-600)] shrink-0" />
                    <span className="text-sm font-medium text-[var(--emerald-700)]">Estrutura validada com sucesso!</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {(screenState === 'warning' || screenState === 'valid') && (() => {
        const StatCard = ({ label, value, Icon }: { label: string; value: string; Icon: React.ElementType }) => (
          <div className="relative bg-white border border-[var(--neutral-200)] px-5 py-4 rounded-2xl overflow-hidden min-h-[110px] flex flex-col justify-between">
            <p className="text-[11px] font-bold text-[var(--neutral-500)] uppercase tracking-widest relative z-10">{label}</p>
            <p className="text-[2.5rem] font-semibold leading-none text-[var(--navy-900)] relative z-10">{value}</p>
            <Icon className="absolute -bottom-2 -right-2 w-20 h-20 text-[var(--neutral-200)]" strokeWidth={1.2} />
          </div>
        );
        return (
          <div ref={summaryRef} className="space-y-3 md:space-y-4 mt-6">
            <h3 className="text-sm font-bold text-[var(--neutral-700)] uppercase tracking-wider">Visão Geral</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <StatCard label="Participantes" value="242" Icon={Users} />
              <StatCard label="Grupos" value="16" Icon={Layers} />
              <StatCard label="Cargos" value="49" Icon={FileText} />
              <StatCard label="Unidades" value="20" Icon={Building2} />
              <StatCard label="CNPJs" value="05" Icon={Fingerprint} />
              <StatCard label="Turnos" value="06" Icon={RotateCcw} />
              <StatCard label="Contratos" value="03" Icon={ClipboardList} />
              <StatCard label="Modelos" value="03" Icon={ShieldCheck} />
            </div>
          </div>
        );
      })()}

      <div className="flex justify-end pt-6 border-t border-[var(--neutral-200)] mt-8">
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto gap-2 group"
          onClick={onNext}
          disabled={screenState === 'idle' || screenState === 'processing'}
        >
          <span>Próximo: Grupos</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <Modal
        isOpen={showExampleModal}
        onClose={() => setShowExampleModal(false)}
        title="Exemplo de Preenchimento"
        description="Veja como o arquivo CSV deve ser estruturado para uma importação correta."
        size="xl"
        footer={
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <FileDown className="w-4 h-4" />
              <span>Baixar modelo</span>
            </Button>
            <Button variant="primary" onClick={() => setShowExampleModal(false)} className="w-full sm:w-auto">
              Fechar
            </Button>
          </div>
        }
      >
        <div className="overflow-x-auto md:overflow-x-hidden">
          <table className="w-full text-xs text-left border-collapse min-w-[600px] md:min-w-0">
            <thead>
              <tr className="border-b border-[var(--neutral-200)]">
                {['Nome', 'E-mail', 'CNPJ', 'Unidade', 'Setor', 'Cargo', 'Turno', 'Contrato', 'Modelo'].map(h => (
                  <th key={h} className="px-2 md:px-3 py-3 font-semibold text-[var(--neutral-700)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--neutral-100)]">
              {[
                ['Mariana Costa', 'mariana.costa@empresa.com', '12.345.678/0001-90', 'Matriz', 'Financeiro', 'Analista Financeira', 'Administrativo', 'CLT', 'Híbrido'],
                ['Carlos Mendes', 'carlos.mendes@empresa.com', '12.345.678/0002-71', 'Filial Campinas', 'Comercial', 'Executivo de Vendas', 'Comercial', 'CLT', 'Presencial'],
                ['Fernanda Alves', 'fernanda.alves@empresa.com', '12.345.678/0001-90', 'Matriz', 'Recursos Humanos', 'Business Partner', 'RH', 'CLT', 'Híbrido'],
                ['Rafael Lima', 'rafael.lima@empresa.com', '98.765.432/0001-55', 'Filial Recife', 'Operações', 'Supervisor Operacional', 'Operações', 'PJ', 'Presencial'],
                ['Juliana Rocha', 'juliana.rocha@empresa.com', '12.345.678/0001-90', 'Matriz', 'Tecnologia', 'Product Designer', 'Produto', 'CLT', 'Remoto'],
                ['Eduardo Nunes', 'eduardo.nunes@empresa.com', '12.345.678/0003-52', 'Filial Curitiba', 'Logística', 'Coordenador de Distribuição', 'Logística', 'Temporário', 'Presencial'],
                ['Patrícia Gomes', 'patricia.gomes@empresa.com', '12.345.678/0001-90', 'Matriz', 'Jurídico', 'Advogada Corporativa', 'Jurídico', 'CLT', 'Híbrido'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[var(--neutral-50)]">
                  {row.map((cell, j) => <td key={j} className="px-2 md:px-3 py-2.5 text-[var(--neutral-700)]">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}
