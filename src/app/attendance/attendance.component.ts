import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EstudiantesService, Estudiante } from '../services/estudiantes.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  grupoSeleccionado = '4-1';
  students: any[] = [];
  emojis = ['😊', '😐', '😢', '😡', '😴', '😃', '😬', '🤒'];

  constructor(
    private http: HttpClient,
    private estudiantesService: EstudiantesService
  ) {}

  ngOnInit() {
    const savedData = localStorage.getItem('asistenciaData');
    if (savedData) {
      this.students = JSON.parse(savedData);
    } else {
      this.cargarAsistencia();
    }
  }

  cargarAsistencia() {
    this.students = [];

    this.http.get<any[]>('https://asistencia-server.onrender.com/obtenerAsistencia')
      .subscribe(data => {
        const asistenciaGrupo = data.filter(s => s.grupo === this.grupoSeleccionado);

        if (asistenciaGrupo.length > 0) {
          const nombresUnicos = new Set();
          this.students = asistenciaGrupo.filter(s => {
            if (nombresUnicos.has(s.name)) return false;
            nombresUnicos.add(s.name);
            return true;
          });
        } else {
          this.estudiantesService.obtenerEstudiantes().subscribe(estudiantes => {
            const filtrados = estudiantes.filter(e => e.grupo === this.grupoSeleccionado);
            this.students = filtrados.map(est => ({
              name: est.nombre_estudiante,
              estado: '',
              emoji: '',
              grupo: est.grupo
            }));
          }, error => {
            console.error('Error al obtener estudiantes desde API:', error);
          });
        }
      }, error => {
        console.error('Error al obtener la asistencia:', error);
      });
  }

  assignEmoji(student: any, emoji: string) {
    student.emoji = emoji;
    localStorage.setItem('asistenciaData', JSON.stringify(this.students));
  }

  guardarAsistencia() {
    const datosLimpios = this.students
      .filter(s => s.emoji)
      .map(({ name, estado, emoji, grupo }) => ({
        name,
        estado,
        emoji,
        grupo,
        fecha: new Date().toISOString().split('T')[0]
      }));

    if (datosLimpios.length === 0) {
      alert('No hay asistencia para guardar.');
      return;
    }

    this.http.post('https://asistencia-server.onrender.com/guardarAsistencia', datosLimpios)
      .subscribe(
        () => {
          alert('Asistencia guardada exitosamente');
          localStorage.removeItem('asistenciaData');
        },
        (error) => {
          console.error('Error al guardar la asistencia:', error);
          alert('Error al guardar la asistencia');
        }
      );
  }
}
