import type { ChangeEvent } from 'react';
import type { FormData } from '../types/reporte.types';
interface Props {
  data: FormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function ReporteForm({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <label htmlFor={key} className="text-sm font-semibold capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>

          <input
            id={key}
            name={key}
            value={value}
            onChange={onChange}
            type={
              key.includes('hora')
                ? 'time'
                : key === 'fecha'
                ? 'date'
                : 'text'
            }
            className="p-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
