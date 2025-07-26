// src/utils/generarReportePdf.ts
import { jsPDF } from 'jspdf';
import type { FormData, Trabajo } from '../types/reporte.types';

/**
 * Genera y descarga un PDF con el contenido del formulario y los trabajos.
 */
export async function generarReportePdf(
  datos: FormData,
  trabajos: Trabajo[],
) {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const margen = 15;
  let y = margen;

  // ---------- Encabezado ----------
  doc.setFontSize(16).setFont('helvetica', 'bold');
  doc.text('Reporte Diario – Sometec', 105, y, { align: 'center' });
  y += 10;

  // ---------- Datos generales ----------
  doc.setFontSize(11).setFont('helvetica', 'normal');

  const campos: (keyof FormData)[] = [
    'fecha', 'contrato', 'zonaTrabajo', 'supervisor', 'prevencionista',
    'vehiculos', 'personal', 'itoMetro', 'acuerdos',
    'horaIngreso', 'horaSalida',
  ];

  campos.forEach((c) => {
    doc.text(`${formatearEtiqueta(c)}: ${datos[c]}`, margen, y);
    y = saltarLinea(doc, y);
  });

  // ---------- Trabajos ----------
  trabajos.forEach((trabajo, i) => {
    y = insertarSubtitulo(doc, `Estación ${i + 1}: ${trabajo.estacion}`, y);

    // SAF
    trabajo.saf.forEach((saf, j) => {
      doc.text(`SAF ${j + 1} – ${saf.titulo}`, margen, y);
      y = saltarLinea(doc, y);
      y = insertarParrafo(doc, saf.detalle, margen + 5, y);
    });

    // Observaciones
    if (trabajo.observaciones) {
      y = insertarParrafo(
        doc,
        `Observaciones: ${trabajo.observaciones}`,
        margen,
        y,
      );
    }

    // Fotos
    for (const { fotoUrl, descripcion } of trabajo.documentacionCamara) {
      const { width, height } = escalarImagen(80, 60); // máximo 80 mm × 60 mm
      if (y + height > 285) doc.addPage(), (y = margen);
      doc.addImage(fotoUrl, 'PNG', margen, y, width, height);
      if (descripcion) {
        doc.text(descripcion, margen + width + 5, y + 5);
      }
      y = saltarLinea(doc, y, height);
    }

    y = saltarLinea(doc, y, 5); // espacio entre estaciones
  });

  // ---------- Guardar ----------
  doc.save(`reporte_${datos.fecha || Date.now()}.pdf`);
}

/* ----------------- Helpers ----------------- */

/** Devuelve etiqueta legible a partir de la clave del objeto */
function formatearEtiqueta(k: string) {
  return k.replace(/([A-Z])/g, ' $1').replace(/^./, (l) => l.toUpperCase());
}

/** Añade salto de línea; si llegamos al final, crea nueva página */
function saltarLinea(doc: jsPDF, yActual: number, salto = 7) {
  const y = yActual + salto;
  if (y > 285) {
    doc.addPage();
    return 15; // margen superior
  }
  return y;
}

/** Inserta subtítulo y devuelve el nuevo Y */
function insertarSubtitulo(doc: jsPDF, texto: string, y: number) {
  doc.setFontSize(13).setFont('helvetica', 'bold');
  doc.text(texto, 15, y);
  doc.setFontSize(11).setFont('helvetica', 'normal');
  return y + 7;
}

/** Inserta párrafo con envoltura automática */
function insertarParrafo(doc: jsPDF, texto: string, x: number, y: number) {
  const lineas = doc.splitTextToSize(texto, 180 - x);
  lineas.forEach((l: any) => {
    doc.text(l, x, y);
    y = saltarLinea(doc, y);
  });
  return y;
}

/** Devuelve ancho y alto manteniendo proporción dentro de los máximos dados */
function escalarImagen(maxW: number, maxH: number) {
  // asume 4:3; ajusta según tu contexto si lo necesitas
  const ratio = maxW / maxH;
  return { width: maxW, height: maxW / ratio };
}
