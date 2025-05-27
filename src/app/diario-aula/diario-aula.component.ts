import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
constructor(private http: HttpClient) {}
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
  const datos = {
    grupo: this.grupo,
    fecha: this.fecha,
    observacion_general: this.observacionGeneral,
    observaciones_individuales: this.observaciones_individuales
  };

  this.http.post('https://asistencia-server.onrender.com/diario-aula', datos)
    .subscribe({
      next: res => {
        console.log('✅ Enviado correctamente:', res);
        alert('Entrada guardada exitosamente');
        this.observacionGeneral = '';
        this.observaciones_individuales = [];
      },
      error: err => {
        console.error('❌ Error al enviar:', err);
        alert('Error al guardar entrada');
      }
    });
}

}

