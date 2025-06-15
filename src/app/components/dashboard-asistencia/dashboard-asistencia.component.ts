import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle,
  ApexNonAxisChartSeries, ApexResponsive, ApexLegend, ApexFill
} from 'ng-apexcharts';
import { ExportacionService } from '../../services/exportacion.service';

@Component({
  selector: 'app-dashboard-asistencia',
  standalone: true,
  templateUrl: './dashboard-asistencia.component.html',
  styleUrls: ['./dashboard-asistencia.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, NgApexchartsModule]
})
export class DashboardAsistenciaComponent implements OnInit, OnDestroy {

  alertasEstudiantes: string[] = [];
  alertaGrupo: string | null = null;

  // Límites configurables:
  limiteAusenciasEstudiante = 3;  // Cantidad de ausencias por estudiante
  limiteAsistenciaGrupo = 80;     // Porcentaje mínimo esperado de asistencia

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

  // Gráficos
  public lineChartOptions: Partial<any> | any;
  public barChartOptions: Partial<any> | any;
  public pieChartOptions: Partial<any> | any;

  // Emojis oficiales
  emojisValidos: string[] = ["🙂", "😐", "😢", "😡", "😴", "😃", "😬", "🤒"];

constructor(private asistenciaService: AsistenciaService, private exportService: ExportacionService) {}

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
  generarAlertas() {
  // Calcula las ausencias por estudiante
  const ausenciasPorEstudiante: { [key: string]: number } = {};

  this.asistenciasFiltradas.forEach(a => {
    if (a.estado === 'Ausente') {
      ausenciasPorEstudiante[a.name] = (ausenciasPorEstudiante[a.name] || 0) + 1;
    }
  });

  this.alertasEstudiantes = Object.entries(ausenciasPorEstudiante)
    .filter(([_, count]) => count >= this.limiteAusenciasEstudiante)
    .map(([name, count]) => `${name}: ${count} ausencias`);

  // Calcula la alerta grupal
  if (this.porcentajeAsistencia < this.limiteAsistenciaGrupo) {
    this.alertaGrupo = `⚠ El grupo tiene solo ${this.porcentajeAsistencia.toFixed(1)}% de asistencia`;
  } else {
    this.alertaGrupo = null;
  }
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
    this.calcularResumen();
    this.generarAlertas();

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

    this.generarGraficos();
  }

  generarGraficos() {
    // Gráfico de evolución temporal (línea)
    const fechas = [...new Set(this.asistenciasFiltradas.map(a => a.createdAt.substring(0, 10)))].sort();
    const seriesAsistencia = fechas.map(fecha => {
      const registrosDia = this.asistenciasFiltradas.filter(a => a.createdAt.startsWith(fecha));
      const presentes = registrosDia.filter(a => a.estado === 'Presente').length;
      const porcentaje = registrosDia.length > 0 ? (presentes / registrosDia.length) * 100 : 0;
      return porcentaje;
    });

    this.lineChartOptions = {
      series: [{ name: "Asistencia (%)", data: seriesAsistencia }],
      chart: { type: "line", height: 300 },
      xaxis: { categories: fechas },
      title: { text: "Evolución temporal de asistencia" }
    };

    // Gráfico de emociones por día (barras apiladas)
    const emocionesPorDia: { [key: string]: { [key: string]: number } } = {};
    fechas.forEach(fecha => {
      emocionesPorDia[fecha] = {};
      this.emojisValidos.forEach(e => emocionesPorDia[fecha][e] = 0);
    });

    this.asistenciasFiltradas.forEach(a => {
      const fecha = a.createdAt.substring(0, 10);
      const emocion = a.emoji || 'Sin dato';
      if (emocionesPorDia[fecha][emocion] !== undefined) {
        emocionesPorDia[fecha][emocion]++;
      }
    });

    const seriesBarras = this.emojisValidos.map(emoji => {
      return {
        name: emoji,
        data: fechas.map(f => emocionesPorDia[f][emoji])
      };
    });

    this.barChartOptions = {
      series: seriesBarras,
      chart: { type: "bar", stacked: true, height: 300 },
      xaxis: { categories: fechas },
      title: { text: "Emociones por día" }
    };

    // Gráfico de pastel
    this.pieChartOptions = {
      series: [this.totalPresentes, this.totalAusentes],
      chart: { type: "pie", height: 300 },
      labels: ["Presente", "Ausente"],
      responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: "bottom" } } }]
    };
  }
  exportarExcel() {
  this.exportService.exportarExcel(this.asistenciasFiltradas, 'asistencia_filtrada');
  }

  exportarPDFVista() {
  this.exportService.exportarVistaComoPDF('dashboard', 'dashboard_completo');
  }

  exportarPDFPorEstudiante(nombre: string) {
  const datosEstudiante = this.asistenciasFiltradas.filter(a => a.name === nombre);
  const rango = `${this.fechaInicio} - ${this.fechaFin}`;
  this.exportService.exportarPDFIndividual(datosEstudiante, nombre, rango);
  }


  ngOnDestroy(): void {
    if (this.asistenciaSub) {
      this.asistenciaSub.unsubscribe();
    }
  }
}
