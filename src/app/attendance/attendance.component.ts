import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  grupoSeleccionado = '4-1'; // Grupo por defecto
  students: any[] = [];
  emojis = ['😊', '😐', '😢', '😡', '😴'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarAsistencia();
  }

  // Carga asistencia o estudiantes nuevos según el grupo
  cargarAsistencia() {
    this.http.get<any[]>('https://asistencia-server.onrender.com/obtenerAsistencia')
      .subscribe(data => {
        if (data.length && data[0].grupo === this.grupoSeleccionado) {
          this.students = data.filter(s => s.grupo === this.grupoSeleccionado);
        } else {
          const archivo = {
            '4-1': '/assets/estudiantes1.json',
            '4-2': '/assets/estudiantes2.json',
            '4-3': '/assets/estudiantes3.json'
          }[this.grupoSeleccionado];
          if (!archivo) {
            console.error('Grupo no válido:', this.grupoSeleccionado);
            return;
          }
          this.http.get<{ name: string }[]>(archivo).subscribe(jsonData => {
            this.students = jsonData.map(student => ({
              ...student,
              estado: '',
              emoji: '',       // ✅ ← Esta coma es la que faltaba
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
  }

  guardarAsistencia() {
    this.http.post('https://asistencia-server.onrender.com/guardarAsistencia', this.students)
      .subscribe({
        next: response => {
          console.log('Asistencia guardada en el servidor:', response);
          alert('✅ Su asistencia ha quedado guardada satisfactoriamente');
          this.students = []; // Limpia solo después de recibir respuesta exitosa
        },
        error: error => {
          console.error('Error al guardar la asistencia:', error);
          alert('❌ Hubo un error al guardar la asistencia');
        }
      });
  }
  
  
}
