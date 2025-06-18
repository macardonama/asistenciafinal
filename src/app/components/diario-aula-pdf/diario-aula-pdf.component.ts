import { Component } from '@angular/core';
import { DiarioAulaService } from '../../services/diario-aula.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-diario-aula-pdf',
  standalone: true,
  templateUrl: './diario-aula-pdf.component.html',
  styleUrls: ['./diario-aula-pdf.component.css']
})
export class DiarioAulaPdfComponent {
  grupo = '';
  fechainicio = '';
  fechafin = '';

  constructor(private diarioAulaService: DiarioAulaService) {}

  generarPDF() {
    if (!this.grupo || !this.fechainicio || !this.fechafin) {
      alert('Por favor complete todos los campos');
      return;
    }

    this.diarioAulaService.filtrarDiarioAula(this.grupo, this.fechainicio, this.fechafin).subscribe(data => {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text(`Diario de Aula - Grupo ${this.grupo}`, 10, 10);
      doc.text(`Desde ${this.fechainicio} hasta ${this.fechafin}`, 10, 18);

      let y = 30;
      data.forEach((entrada: any, index: number) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. Fecha: ${entrada.fecha.substring(0, 10)}`, 10, y);
        doc.text(`Observación General: ${entrada.observacionGeneral || 'N/A'}`, 10, y + 8);

        if (entrada.observaciones_individuales?.length > 0) {
        autoTable(doc, {
          startY: y + 15,
          head: [['Estudiante', 'Observación', '¿Enviado a padre?']],
          body: entrada.observaciones_individuales.map((obs: any) => [
            obs.nombre_estudiante,
            obs.observacion,
            obs.enviar_a_padre ? 'Sí' : 'No'
          ])
        });
        y = (doc as any).lastAutoTable.finalY + 10;

        }
      });

      doc.save(`DiarioAula_${this.grupo}_${this.fechainicio}_a_${this.fechafin}.pdf`);
    });
  }
}
