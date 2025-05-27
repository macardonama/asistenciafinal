import { Component, OnInit } from '@angular/core';
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
export class DiarioAulaComponent implements OnInit {
  grupo: string = '4-3';
  fecha: string = new Date().toISOString().substring(0, 10);
  observacionGeneral: string = '';
  estudiantes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarEstudiantes();
  }

  cargarEstudiantes() {
    this.http.get<any[]>('assets/estudiantes3.json').subscribe(data => {
      this.estudiantes = data.map(e => ({
        nombre_estudiante: e.nombre,
        observacion: '',
        enviar_a_padre: false
      }));

    });
  }

  guardar() {
    const datos = {
      grupo: this.grupo,
      fecha: this.fecha,
      observacion_general: this.observacionGeneral,
      observaciones_individuales: this.estudiantes
    };

    this.http.post('https://asistencia-server.onrender.com/diario-aula', datos)
      .subscribe({
        next: res => {
          alert('✅ Entrada guardada exitosamente');
        },
        error: err => {
          alert('❌ Error al guardar entrada');
          console.error(err);
        }
      });
  }
}
