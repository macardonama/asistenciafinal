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
  let archivo = '';
  switch (this.grupo) {
    case '4-1':
      archivo = 'estudiantes1.json'; break;
    case '4-2':
      archivo = 'estudiantes2.json'; break;
    case '4-3':
      archivo = 'estudiantes3.json'; break;
    case '4-4':
      archivo = 'estudiantes4.json'; break;
  }

  this.http.get<any[]>(`assets/${archivo}`).subscribe(data => {
    this.estudiantes = data.map(est => ({
      ...est,
      observacion: '',
      enviar_a_padre: false
    }));
  });
}


  guardar() {
  const observaciones_validas = this.estudiantes
    .filter(est => est.observacion.trim() !== '' || est.enviar_a_padre)
    .map(est => ({
      nombre_estudiante: est.name,
      observacion: est.observacion,
      enviar_a_padre: est.enviar_a_padre
    }));

  const datos = {
    grupo: this.grupo,
    fecha: this.fecha,
    observacion_general: this.observacionGeneral,
    observaciones_individuales: observaciones_validas
  };

  console.log('Datos que se envían:', datos);

  this.http.post('https://asistencia-server.onrender.com/diario-aula', datos)
    .subscribe({
      next: res => {
        console.log('✅ Enviado correctamente:', res);
        alert('Entrada guardada exitosamente');
        this.observacionGeneral = '';
        this.estudiantes.forEach(e => {
          e.observacion = '';
          e.enviar_a_padre = false;
        });
      },
      error: err => {
        console.error('❌ Error al enviar:', err);
        alert('Error al guardar entrada');
      }
    });
}



}
