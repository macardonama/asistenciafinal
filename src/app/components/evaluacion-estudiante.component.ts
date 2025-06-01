import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-evaluacion-estudiante',
  templateUrl: './evaluacion-estudiante.component.html',
  styleUrl: './evaluacion-estudiante.component.css',
  imports: [CommonModule, FormsModule,RouterModule]
})
export class EvaluacionEstudianteComponent implements OnInit {
  tiempoInicio: number = 0;
  estudiantes: string[] = [];
  grupoSeleccionado: string = '';
  nombreSeleccionado: string = '';
  pregunta: any = null;
  respuestaSeleccionada: string = '';
  resultado: string = '';
  cargando: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

 cargarEstudiantes() {
  if (!this.grupoSeleccionado) return;

  const grupoNumero = this.grupoSeleccionado.split('-')[1]; // "1", "2", etc.
  const archivo = `/assets/estudiantes${grupoNumero}.json`;

  this.http.get<{ name: string }[]>(archivo)
    .subscribe(data => {
      this.estudiantes = data.map(est => est.name);
    });
}


  
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
          this.tiempoInicio = Date.now();
        },
        error: () => {
          this.resultado = 'Error al cargar la pregunta.';
          this.cargando = false;
        }
      });
  }

  enviarRespuesta() {
  if (!this.pregunta || !this.respuestaSeleccionada) return;

  const tiempo = Date.now() - this.tiempoInicio;

  const datos = {
    nombre_estudiante: this.nombreSeleccionado,
    grupo: this.grupoSeleccionado,
    pregunta_id: this.pregunta._id,
    respuesta: this.respuestaSeleccionada,
    tiempo
  };

  this.http.post<any>('https://asistencia-server.onrender.com/api/evaluacion/respuesta', datos)
    .subscribe({
      next: (res) => {
        this.resultado = res.correcta ? `¡Correcto! 🎉 Puntaje: ${res.puntaje}` : `Incorrecto 😕 Puntaje: ${res.puntaje}`;
      },
      error: () => {
        this.resultado = 'Error al enviar la respuesta.';
      }
    });
}
reiniciarEvaluacion() {
  this.nombreSeleccionado = '';
  this.pregunta = null;
  this.respuestaSeleccionada = '';
  this.resultado = '';
}


}
