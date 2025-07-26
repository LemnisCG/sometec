import type { ChangeEvent } from 'react';
import type { SAF } from '../types/reporte.types';
interface Props {
  saf: SAF;
  onFieldChange: (field: keyof SAF, value: string) => void;
}

export default function SAFEntry({ saf, onFieldChange }: Props) {
  return (
    <div className="space-y-2">
      <input
        placeholder="Título SAF"
        value={saf.titulo}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onFieldChange('titulo', e.target.value)
        }
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      <textarea
        placeholder="Detalle"
        value={saf.detalle}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onFieldChange('detalle', e.target.value)
        }
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  );
}
