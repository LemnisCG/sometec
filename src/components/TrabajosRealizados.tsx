import type { Trabajo, SAF } from '../types/reporte.types'; 
import TrabajoCard from './TrabajoCard';

interface Props {
  trabajos: Trabajo[];
  setTrabajos: (value: Trabajo[]) => void;
}

export default function TrabajosRealizados({ trabajos, setTrabajos }: Props) {
  /* Helpers para mutar estado inmutablemente */
  const handleTrabajoChange =
    (idx: number) => (field: keyof Trabajo, value: string) => {
      setTrabajos(
        trabajos.map((t, i) => (i === idx ? { ...t, [field]: value } : t))
      );
    };

  const handleSafChange =
    (trabajoIdx: number) =>
    (safIdx: number, field: keyof SAF, value: string) => {
      setTrabajos(
        trabajos.map((t, i) =>
          i === trabajoIdx
            ? {
                ...t,
                saf: t.saf.map((s, j) =>
                  j === safIdx ? { ...s, [field]: value } : s
                ),
              }
            : t
        )
      );
    };

  const addSaf = (trabajoIdx: number) => {
    setTrabajos(
      trabajos.map((t, i) =>
        i === trabajoIdx ? { ...t, saf: [...t.saf, { titulo: '', detalle: '' }] } : t
      )
    );
  };

  const addTrabajo = () => {
    setTrabajos([
      ...trabajos,
      { estacion: '', saf: [{ titulo: '', detalle: '' }], observaciones: '' },
    ]);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Trabajos Realizados</h3>

      {trabajos.map((trabajo, idx) => (
        <TrabajoCard
          key={idx}
          trabajo={trabajo}
          onTrabajoChange={handleTrabajoChange(idx)}
          onSafChange={handleSafChange(idx)}
          addSaf={() => addSaf(idx)}
        />
      ))}

      <button
        type="button"
        onClick={addTrabajo}
        className="text-blue-600 text-sm"
      >
        + Agregar Estación
      </button>
    </div>
  );
}
