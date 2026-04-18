'use client';

import { CheckCircle2, Users, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/fluir/card';
import { Button } from '@/components/fluir/button';
import { Badge } from '@/components/fluir/badge';

interface Step3Props {
  onBack: () => void;
  onFinish: () => void;
}

export default function Step3Review({ onBack, onFinish }: Step3Props) {
  return (
    <div className="space-y-6">
      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--neutral-900)] mb-2">Revisão e Ativação</h2>
        <p className="text-[var(--neutral-600)]">Confira os dados antes de disparar os convites para os participantes.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="p-5 border-b border-[var(--neutral-100)]">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--navy-500)]" />
              Base de Participantes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {[
              ['Total de convidados:', '248 trabalhadores', true],
              ['Unidades mapeadas:',   '2 (Matriz e Filial SP)', false],
            ].map(([label, value, bold]) => (
              <div key={label as string} className="flex justify-between items-center py-2 border-b border-[var(--neutral-100)]">
                <span className="text-[var(--neutral-500)]">{label}</span>
                <span className={bold ? 'font-bold text-[var(--navy-900)]' : 'font-semibold text-[var(--neutral-900)]'}>{value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2">
              <span className="text-[var(--neutral-500)]">Privacidade:</span>
              <Badge variant="success">Anonimato Garantido</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-5 border-b border-[var(--neutral-100)]">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--navy-500)]" />
              Cronograma
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {[
              ['Abertura:',      '01/09/2026 às 08:00', false],
              ['Encerramento:',  '21/09/2026 às 23:59', false],
              ['Duração Total:', '21 dias', true],
            ].map(([label, value, bold]) => (
              <div key={label as string} className="flex justify-between items-center py-2 border-b last:border-0 border-[var(--neutral-100)]">
                <span className="text-[var(--neutral-500)]">{label}</span>
                <span className={bold ? 'font-bold text-[var(--navy-900)]' : 'font-semibold text-[var(--neutral-900)]'}>{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6 border-t border-[var(--neutral-200)] mt-8">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button
          variant="primary"
          className="bg-[var(--emerald-600)] hover:bg-[var(--emerald-700)] border-none text-white"
          onClick={onFinish}
        >
          Finalizar e Ativar Campanha
          <CheckCircle2 className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
