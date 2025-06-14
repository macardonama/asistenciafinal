import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-asistencia',
  standalone: true,
  templateUrl: './dashboard-asistencia.component.html',
  styleUrls: ['./dashboard-asistencia.component.css']
})
export class DashboardAsistenciaComponent implements OnInit, OnDestroy {

  asistencias: any[] = [];
  resumen: any = {};
  asistenciaSub: Subscription | undefined;

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    this.cargarAsistencias();
  }

  cargarAsistencias() {
  this.asistenciaSub = this.asistenciaService.getTodasAsistencias().subscribe({
    next: data => {
      console.log('Datos recibidos:', data);
      this.asistencias = data ?? []; 
      this.calcularResumen();
    },
    error: err => {
      console.error('Error al obtener asistencias:', err);
      this.asistencias = [];
      this.resumen = {};
    }
  });
}

  calcularResumen() {
    const resumenEmociones: any = {};
    for (let item of this.asistencias) {
      const emocion = item.emocion || 'Sin dato';
      resumenEmociones[emocion] = (resumenEmociones[emocion] || 0) + 1;
    }
    this.resumen = resumenEmociones;
  }

  ngOnDestroy(): void {
    if (this.asistenciaSub) {
      this.asistenciaSub.unsubscribe();
    }
  }
}
