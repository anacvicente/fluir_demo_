'use client';

import { ArrowRight, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/fluir/card';
import { Button } from '@/components/fluir/button';
import { Alert } from '@/components/fluir/alert';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Duration({ onNext, onBack }: Step2Props) {
  return (
    <div className="space-y-6">
      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--neutral-900)] mb-2">Definir Duração</h2>
        <p className="text-[var(--neutral-600)]">Configure a janela de tempo em que a pesquisa ficará aberta para respostas.</p>
      </section>

      <Card className="border-t-4 border-t-[var(--navy-500)]">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">Data de Início</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--neutral-400)]" />
                <input type="date" className="w-full pl-10 pr-4 py-2 border border-[var(--neutral-300)] rounded-lg focus:ring-2 focus:ring-[var(--navy-500)] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">Data de Encerramento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--neutral-400)]" />
                <input type="date" className="w-full pl-10 pr-4 py-2 border border-[var(--neutral-300)] rounded-lg focus:ring-2 focus:ring-[var(--navy-500)] outline-none" />
              </div>
            </div>
          </div>
          <Alert variant="info" className="mt-4">
            Recomendamos um período de <strong>15 a 21 dias</strong> para garantir uma alta taxa de adesão sem perder o engajamento inicial da comunicação.
          </Alert>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6 border-t border-[var(--neutral-200)]">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button onClick={onNext}>
          Revisar Campanha
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
