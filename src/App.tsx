import  { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react'
import type { FormData, Trabajo } from './types/reporte.types'; 
import ReporteForm from './components/ReporteForm';
import TrabajosRealizados from './components/TrabajosRealizados';

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    fecha: '',
    contrato: '',
    zonaTrabajo: '',
    supervisor: '',
    prevencionista: '',
    vehiculos: '',
    personal: '',
    itoMetro: '',
    acuerdos: '',
    horaIngreso: '',
    horaSalida: '',
  });

  const [trabajos, setTrabajos] = useState<Trabajo[]>([
    { estacion: '', saf: [{ titulo: '', detalle: '' }], observaciones: '' },
  ]);

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Datos enviados:', { ...formData, trabajos });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">
          Reporte Diario Sometec
        </h2>

        <ReporteForm data={formData} onChange={handleFormChange} />

        <TrabajosRealizados trabajos={trabajos} setTrabajos={setTrabajos} />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-semibold"
        >
          Enviar Reporte
        </button>
      </form>
    </div>
  );
}
