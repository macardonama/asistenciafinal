import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-asistencia',
  standalone: true,
  templateUrl: './dashboard-asistencia.component.html',
  styleUrls: ['./dashboard-asistencia.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class DashboardAsistenciaComponent implements OnInit, OnDestroy {

  asistencias: any[] = [];
  asistenciasFiltradas: any[] = [];
  asistenciaSub: Subscription | undefined;

  fechaInicio: string = '';
  fechaFin: string = '';
  grupoSeleccionado: string = 'Todos';
  estadoSeleccionado: string = 'Todos';
  diaSeleccionado: string = 'Todos';

  gruposDisponibles: string[] = [];
  diasDisponibles: string[] = ['Todos', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  totalRegistros = 0;
  totalPresentes = 0;
  totalAusentes = 0;
  porcentajeAsistencia = 0;
  emocionDominante = '';
  resumenEmociones: { [key: string]: number } = {};

  // Emojis oficiales
  emojisValidos: string[] = ["🙂", "😐", "😢", "😡", "😴", "😃", "😬", "🤒"];

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    this.cargarAsistencias();
  }

  cargarAsistencias() {
    this.asistenciaSub = this.asistenciaService.getTodasAsistencias().subscribe({
      next: data => {
        this.asistencias = data ?? [];
        this.gruposDisponibles = [...new Set(this.asistencias.map(a => a.grupo))];
        this.filtrarDatos();
      },
      error: err => {
        console.error('Error al obtener asistencias:', err);
        this.asistencias = [];
      }
    });
  }

  filtrarDatos() {
    let data = [...this.asistencias];

    if (this.fechaInicio) {
      const inicio = new Date(this.fechaInicio);
      data = data.filter(a => new Date(a.createdAt) >= inicio);
    }

    if (this.fechaFin) {
      const fin = new Date(this.fechaFin);
      data = data.filter(a => new Date(a.createdAt) <= fin);
    }

    if (this.grupoSeleccionado !== 'Todos') {
      data = data.filter(a => a.grupo === this.grupoSeleccionado);
    }

    if (this.estadoSeleccionado !== 'Todos') {
      data = data.filter(a => a.estado === this.estadoSeleccionado);
    }

    if (this.diaSeleccionado !== 'Todos') {
      data = data.filter(a => {
        const dia = this.obtenerDiaSemana(new Date(a.createdAt));
        return dia === this.diaSeleccionado;
      });
    }

    this.asistenciasFiltradas = data;
    this.calcularResumen();
  }

  obtenerDiaSemana(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()];
  }

  calcularResumen() {
    this.totalRegistros = this.asistenciasFiltradas.length;
    this.totalPresentes = this.asistenciasFiltradas.filter(a => a.estado === 'Presente').length;
    this.totalAusentes = this.asistenciasFiltradas.filter(a => a.estado === 'Ausente').length;
    this.porcentajeAsistencia = this.totalRegistros > 0 ? (this.totalPresentes / this.totalRegistros) * 100 : 0;

    const emociones: { [key: string]: number } = {};
    this.asistenciasFiltradas.forEach(a => {
      const emocion = a.emoji || 'Sin dato';
      emociones[emocion] = (emociones[emocion] || 0) + 1;
    });

    this.resumenEmociones = emociones;

    const maxEmocion = Object.entries(emociones).reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);
    this.emocionDominante = maxEmocion[0] ?? '';
  }

  ngOnDestroy(): void {
    if (this.asistenciaSub) {
      this.asistenciaSub.unsubscribe();
    }
  }
}
