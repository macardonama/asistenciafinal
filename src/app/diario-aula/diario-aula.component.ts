import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-diario-aula',
  imports: [CommonModule, FormsModule],
  templateUrl: './diario-aula.component.html',
  styleUrl: './diario-aula.component.css'
})
export class DiarioAulaComponent {
  grupo: string = '4-3';
  fecha: string = new Date().toISOString().substring(0, 10);
  observacionGeneral: string = '';

  nuevaObs: any = {
    nombre_estudiante: '',
    observacion: '',
    enviar_a_padre: false
  };

  observaciones_individuales: any[] = [];

  agregarObservacion() {
    if (this.nuevaObs.nombre_estudiante && this.nuevaObs.observacion) {
      this.observaciones_individuales.push({ ...this.nuevaObs });
      this.nuevaObs = {
        nombre_estudiante: '',
        observacion: '',
        enviar_a_padre: false
      };
    }
  }

  eliminarObservacion(index: number) {
    this.observaciones_individuales.splice(index, 1);
  }

  guardar() {
    // Lógica de envío POST al backend (a agregar más adelante)
    console.log('Enviando datos:', {
      grupo: this.grupo,
      fecha: this.fecha,
      observacion_general: this.observacionGeneral,
      observaciones_individuales: this.observaciones_individuales
    });
  }
}

