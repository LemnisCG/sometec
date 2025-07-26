import { useState } from 'react';
import type { Trabajo, SAF, DocumentacionCamara } from '../types/reporte.types';
import SAFEntry from './SAFEntry';
import CameraCapture from './CameraCapture';

interface Props {
  trabajo: Trabajo;
  onTrabajoChange: <K extends keyof Trabajo>(campo: K, valor: Trabajo[K]) => void;
  onSafChange: (safIdx: number, campo: keyof SAF, valor: string) => void;
  addSaf: () => void;
}

export default function TrabajoCard({
  trabajo,
  onTrabajoChange,
  onSafChange,
  addSaf,
}: Props) {
  const [cameraOpen, setCameraOpen] = useState(false);

  /* añade una nueva foto */
  const agregarDoc = (doc: DocumentacionCamara) => {
    const nuevasFotos = [...trabajo.documentacionCamara, doc];
    onTrabajoChange('documentacionCamara', nuevasFotos);
  };

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
          onFieldChange={(campo, valor) => onSafChange(idx, campo, valor)}
        />
      ))}
      <button type="button" onClick={addSaf} className="text-sm text-blue-600">
        + Agregar SAF
      </button>

      {/* Observaciones */}
      <div className="space-y-2">
        <label className="font-semibold">Observaciones</label>
        <textarea
          value={trabajo.observaciones}
          onChange={e => onTrabajoChange('observaciones', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Fotos */}
      <div className="space-y-2">
        {cameraOpen ? (
          <CameraCapture
            onCapture={agregarDoc}
            onClose={() => setCameraOpen(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="text-sm text-blue-600 underline"
          >
            📷 Tomar Foto
          </button>
        )}

        {/* miniaturas */}
        {trabajo.documentacionCamara?.map((doc, i) => (
          <div key={i} className="flex items-start gap-2">
            <img
              src={doc.fotoUrl}
              alt={`Foto ${i + 1}`}
              className="w-24 h-24 object-cover rounded-lg border"
            />
            <p className="flex-1">{doc.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
