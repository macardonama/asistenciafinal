import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexNonAxisChartSeries, ApexResponsive, ApexLegend } from 'ng-apexcharts';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
}

export interface PieChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
}

@Component({
  selector: 'app-dashboard-asistencia',
  standalone: true,
  templateUrl: './dashboard-asistencia.component.html',
  styleUrls: ['./dashboard-asistencia.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, NgApexchartsModule]
})
export class DashboardAsistenciaComponent implements OnInit, OnDestroy {

  asistencias: any[] = [];
  asistenciasFiltradas: any[] = [];
  asistenciaSub: Subscription | undefined;

  fechaInicio: string = '';
  fechaFin: string = '';
  grupoSeleccionado: string = 'Todos';
  estadoSeleccionado: string = 'Todos';

  gruposDisponibles: string[] = [];

  // KPIs
  totalRegistros = 0;
  totalPresentes = 0;
  totalAusentes = 0;
  porcentajeAsistencia = 0;
  resumenEmociones: { [key: string]: number } = {};
  emocionDominante: string = '';

  // Charts
  public barChartOptions: Partial<ChartOptions> | any;
  public pieChartOptions: Partial<PieChartOptions> | any;

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

    this.asistenciasFiltradas = data;
    this.calcularResumen();
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

    // emoción dominante
    const maxEmocion = Object.entries(emociones).reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);
    this.emocionDominante = maxEmocion[0] ?? '';

    this.generarGraficos();
  }

  generarGraficos() {
    // Gráfico de barras (emociones)
    this.barChartOptions = {
      series: [{
        name: "Cantidad",
        data: Object.values(this.resumenEmociones)
      }],
      chart: { type: "bar", height: 350 },
      xaxis: {
        categories: Object.keys(this.resumenEmociones)
      },
      title: { text: "Distribución de emociones" }
    };

    // Gráfico de pastel (presentes vs ausentes)
    this.pieChartOptions = {
      series: [this.totalPresentes, this.totalAusentes],
      chart: { type: "pie", height: 350 },
      labels: ["Presente", "Ausente"],
      responsive: [{
        breakpoint: 480,
        options: { chart: { width: 200 }, legend: { position: "bottom" } }
      }]
    };
  }

  ngOnDestroy(): void {
    if (this.asistenciaSub) {
      this.asistenciaSub.unsubscribe();
    }
  }
}
