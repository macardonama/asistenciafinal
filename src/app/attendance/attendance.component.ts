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

  // Paso 1: Obtener la lista oficial de estudiantes desde acudientes
  this.estudiantesService.obtenerEstudiantes().subscribe(estudiantes => {
    const estudiantesDelGrupo = estudiantes.filter(e => e.grupo === this.grupoSeleccionado);

    // Paso 2: Obtener asistencia (por si ya existe) y emparejarla con los estudiantes válidos
    this.http.get<any[]>('https://asistencia-server.onrender.com/obtenerAsistencia')
      .subscribe(asistencias => {
        const asistenciaDelGrupo = asistencias.filter(a => a.grupo === this.grupoSeleccionado);
        const asistenciaMap = new Map(asistenciaDelGrupo.map(a => [a.name, a]));

        // Paso 3: Crear la lista final solo con estudiantes que están en acudientes
        this.students = estudiantesDelGrupo.map(est => {
          const asistencia = asistenciaMap.get(est.nombre_estudiante);
          return {
            name: est.nombre_estudiante,
            grupo: est.grupo,
            estado: asistencia?.estado || '',
            emoji: asistencia?.emoji || ''
          };
        });
      }, error => {
        console.error('Error al obtener asistencia:', error);
        // Si no hay asistencia, simplemente cargamos los estudiantes vacíos
        this.students = estudiantesDelGrupo.map(est => ({
          name: est.nombre_estudiante,
          grupo: est.grupo,
          estado: '',
          emoji: ''
        }));
      });
  }, error => {
    console.error('Error al obtener estudiantes desde API:', error);
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
