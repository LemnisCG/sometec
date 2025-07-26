import { useState } from 'react';
import type { Trabajo, SAF } from '../types/reporte.types';
import SAFEntry from './SAFEntry';
import CameraCapture from './CameraCapture';

interface Props {
  trabajo: Trabajo;
  onTrabajoChange: (field: keyof Trabajo, value: string) => void;
  onSafChange: (safIdx: number, field: keyof SAF, value: string) => void;
  addSaf: () => void;
}

export default function TrabajoCard({
  trabajo,
  onTrabajoChange,
  onSafChange,
  addSaf,
}: Props) {
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <div className="border p-4 rounded-lg space-y-4 bg-gray-50">
      {/* Estación */}
      <div>
        <label className="font-semibold">Estación</label>
        <input
          value={trabajo.estacion}
          onChange={e => onTrabajoChange('estacion', e.target.value)}
          className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
        />
      </div>

      {/* SAFs */}
      {trabajo.saf.map((saf, idx) => (
        <SAFEntry
          key={idx}
          saf={saf}
          onFieldChange={(field, value) => onSafChange(idx, field, value)}
        />
      ))}

      <button type="button" onClick={addSaf} className="text-sm text-blue-600">
        + Agregar SAF
      </button>

      {/* Observaciones + Foto */}
      <div className="space-y-2">
        <label className="font-semibold">Observaciones</label>
        <textarea
          value={trabajo.observaciones}
          onChange={e => onTrabajoChange('observaciones', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />

        {cameraOpen ? (
          <CameraCapture
            onCapture={dataUrl => onTrabajoChange('fotoUrl', dataUrl)}
            onClose={() => setCameraOpen(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="mt-2 text-sm text-blue-600 underline"
          >
            📷 Tomar Foto
          </button>
        )}

        {trabajo.fotoUrl && (
          <img
            src={trabajo.fotoUrl}
            alt="Foto observación"
            className="mt-2 rounded-lg border max-w-xs"
          />
        )}
      </div>
    </div>
  );
}
