import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  grupoSeleccionado = '4-1'; // Grupo por defecto
  students: any[] = [];
  emojis = ['😊', '😐', '😢', '😡', '😴', '😃', '😬', '🤒'];  // 🔄 NUEVAS EMOCIONES

  constructor(private http: HttpClient) {}

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
        if (data.length && data[0].grupo === this.grupoSeleccionado) {
          const estudiantesGrupo = data.filter(s => s.grupo === this.grupoSeleccionado);
          // Eliminar duplicados por nombre (solo deja el primero que encuentra)
          const nombresUnicos = new Set();
          this.students = estudiantesGrupo.filter(s => {
            if (nombresUnicos.has(s.name)) return false;
            nombresUnicos.add(s.name);
            return true;
          });
        } else {
          const archivo = {
            '4-1': '/assets/estudiantes1.json',
            '4-2': '/assets/estudiantes2.json',
            '4-3': '/assets/estudiantes3.json',
            '4-4': '/assets/estudiantes4.json'
          }[this.grupoSeleccionado];
          if (!archivo) {
            console.error('Grupo no válido:', this.grupoSeleccionado);
            return;
          }
          this.http.get<{ name: string }[]>(archivo).subscribe(jsonData => {
            this.students = jsonData.map(student => ({
              ...student,
              estado: '',
              emoji: '',
              grupo: this.grupoSeleccionado
            }));
          });
        }
      }, error => {
        console.error('Error al obtener la asistencia:', error);
      });
  }

  assignEmoji(student: any, emoji: string) {
    student.emoji = emoji;
    localStorage.setItem('asistenciaData', JSON.stringify(this.students));  // 💾 Guarda el progreso
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

    console.log('Enviando asistencia:', datosLimpios);

    this.http.post('https://asistencia-server.onrender.com/guardarAsistencia', datosLimpios)
      .subscribe(
        () => {
          alert('Asistencia guardada exitosamente');
          localStorage.removeItem('asistenciaData');  // 🧹 Limpia el guardado
        },
        (error) => {
          console.error('Error al guardar la asistencia:', error);
          alert('Error al guardar la asistencia');
        }
      );
  }
}
