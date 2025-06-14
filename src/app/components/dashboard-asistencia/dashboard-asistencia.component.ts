import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-dashboard-asistencia',
  standalone: true,
  templateUrl: './dashboard-asistencia.component.html',
  styleUrls: ['./dashboard-asistencia.component.css']
})
export class DashboardAsistenciaComponent implements OnInit {

  asistencias: any[] = [];
  resumen: any = {};

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    this.cargarAsistencias();
  }

  cargarAsistencias() {
    this.asistenciaService.getTodasAsistencias().subscribe(data => {
      this.asistencias = data;
      this.calcularResumen();
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
}
