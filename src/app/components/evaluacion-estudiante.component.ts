import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-evaluacion-estudiante',
  templateUrl: './evaluacion-estudiante.component.html',
  styleUrl: './evaluacion-estudiante.component.css',
  imports: []
})
export class EvaluacionEstudianteComponent implements OnInit {
  estudiantes = ['Ana', 'Brayan', 'Carlos', 'Daniela'];
  nombreSeleccionado: string = '';
  pregunta: any = null;
  respuestaSeleccionada: string = '';
  resultado: string = '';
  cargando: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  seleccionarEstudiante(nombre: string) {
    this.nombreSeleccionado = nombre;
    this.obtenerPregunta();
  }

  obtenerPregunta() {
    this.cargando = true;
    this.http.get('https://asistencia-server.onrender.com/api/evaluacion/pregunta')
      .subscribe({
        next: (data) => {
          this.pregunta = data;
          this.cargando = false;
        },
        error: () => {
          this.resultado = 'Error al cargar la pregunta.';
          this.cargando = false;
        }
      });
  }

  enviarRespuesta() {
    if (!this.pregunta || !this.respuestaSeleccionada) return;

    this.http.post('https://asistencia-server.onrender.com/api/evaluacion/respuesta', {
      pregunta_id: this.pregunta._id,
      respuesta: this.respuestaSeleccionada
    }).subscribe((res: any) => {
      this.resultado = res.correcta ? '¡Correcto! 🎉' : 'Incorrecto 😕';
    });
  }
}
