import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';


@Injectable({
  providedIn: 'root'
})
export class ExportacionService {

  exportarExcel(datos: any[], nombreArchivo: string = 'asistencia') {
    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${nombreArchivo}.xlsx`);
  }

  exportarPDFIndividual(datos: any[], estudiante: string, rangoFechas: string) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Reporte de Asistencia - ${estudiante}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Rango de fechas: ${rangoFechas}`, 10, 30);

    const columnas = ["Fecha", "Estado", "Emoción"];
    const filas = datos.map(a => [
      a.createdAt.substring(0, 10),
      a.estado,
      a.emoji
    ]);

    (doc as any).autoTable({
      head: [columnas],
      body: filas,
      startY: 40
    });

    doc.save(`asistencia_${estudiante}.pdf`);
  }

  exportarVistaComoPDF(elementId: string, nombreArchivo: string) {
    const input = document.getElementById(elementId);
    if (input) {
      html2canvas(input).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = (pdf as any).getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${nombreArchivo}.pdf`);
      });
    }
  }
}
