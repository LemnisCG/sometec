import { jsPDF } from 'jspdf';
import type { FormData, Trabajo } from '../types/reporte.types';

export async function generarReportePdf(
  datos: FormData,
  trabajos: Trabajo[],
) {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margen = 15;
  let y = 15;

  const azul = '#004f91';
  const gris = '#e6e6e6';

  // ----- CABECERA -----
  doc.setFillColor(azul);
  doc.rect(0, 0, pageWidth, 20, 'F');

  doc.setFontSize(14).setTextColor(255).setFont('helvetica', 'bold');
  doc.text('SOMETEC', margen, 13);

  doc.setFontSize(10).setFont('helvetica', 'normal');
  doc.text(`Fecha emisión: ${datos.fecha || ''}`, pageWidth - margen, 13, { align: 'right' });

  y = 25;

  // ----- DATOS EN CUADRICULA -----
  const campos: [string, string][] = [
    ['Contrato / Trabajo', datos.contrato],
    ['Estación / Zona de trabajo', datos.zonaTrabajo],
    ['Supervisor a Cargo', datos.supervisor],
    ['Prevencionista de riesgo', datos.prevencionista],
    ['Vehículos Utilizados', datos.vehiculos],
    ['Listado de Personal', datos.personal],
    ['ITO / METRO PRESENTE', datos.itoMetro],
    ['Acuerdo con ITO o METRO', datos.acuerdos],
    ['Hora Ingreso a la Estación', datos.horaIngreso],
    ['Hora Salida de la Estación', datos.horaSalida],
  ];

  const colW = (pageWidth - 2 * margen) / 2;
  const rowH = 10;
  campos.forEach((fila, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = margen + col * colW;
    const yPos = y + row * rowH;

    doc.setDrawColor(180);
    doc.rect(x, yPos, colW, rowH);
    doc.setFontSize(9).setTextColor(0).setFont('helvetica', 'bold');
    doc.text(fila[0].toUpperCase(), x + 2, yPos + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(fila[1] || '-', x + 2, yPos + 8);
  });

  y += Math.ceil(campos.length / 2) * rowH + 10;

  // ----- TRABAJOS REALIZADOS -----
  doc.setFontSize(12).setTextColor(azul).setFont('helvetica', 'bold');
  doc.text('TRABAJOS REALIZADOS', margen, y);
  y += 10;

  for (const trabajo of trabajos) {
    if (y > 250) doc.addPage(), (y = 20);

    doc.setFontSize(11).setTextColor(azul).setFont('helvetica', 'bold');
    doc.text(`Estación: ${trabajo.estacion}`, margen, y);
    y += 7;

    doc.setFontSize(10).setTextColor(50).setFont('helvetica', 'normal');
    for (const saf of trabajo.saf) {
      doc.setFont('helvetica', 'bold').text(`SAF – ${saf.titulo}`, margen, y);
      y += 5;
      y = insertarParrafo(doc, saf.detalle, margen + 4, y);
    }

    if (trabajo.observaciones) {
      y = insertarParrafo(doc, `Observaciones: ${trabajo.observaciones}`, margen, y);
    }

    for (const { fotoUrl, descripcion } of trabajo.documentacionCamara) {
      const imgW = 146.6; // mm
      const imgH = 132;   // mm
      const x = (pageWidth - imgW) / 2;

      if (y + imgH > 280) {
        doc.addPage();
        y = 20;
      }

      // Imagen centrada
      doc.addImage(fotoUrl, 'PNG', x, y, imgW, imgH);

      // Fondo gris para descripción
      doc.setFillColor(gris);
      doc.rect(x, y + imgH - 12, imgW, 12, 'F');

      // Texto descripción
      doc.setTextColor(0).setFontSize(9);
      doc.text(descripcion || '', x + 5, y + imgH - 4);

      y += imgH + 10;
    }

    y += 5;
  }

  // ----- PIE DE PÁGINA -----
  doc.setDrawColor(200);
  doc.line(margen, 285, pageWidth - margen, 285);
  doc.setFontSize(9).setTextColor(70);
  doc.text(
    'Sometec – ISO 9001 | OHSAS 18001 | ISO 14001 | www.sometec.cl | +56 9 6413 2879',
    pageWidth / 2,
    290,
    { align: 'center' }
  );

  doc.save(`reporte_${datos.fecha || Date.now()}.pdf`);
}

/* ----------------- Helpers ----------------- */

function insertarParrafo(doc: jsPDF, texto: string, x: number, y: number) {
  const lineas = doc.splitTextToSize(texto, 180 - x);
  lineas.forEach((l: string) => {
    doc.text(l, x, y);
    y += 6;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });
  return y;
}
