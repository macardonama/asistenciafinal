import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluappService } from '../../services/evaluapp.service';  // Cambia si tu service está en otra ruta
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-evaluapp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard-evaluapp.component.html',
  styleUrls: ['./dashboard-evaluapp.component.css']
})
export class DashboardEvaluappComponent implements OnInit {

  grupoSeleccionado: string = '4-3';
  fechaInicio: string = '';
  fechaFin: string = '';
  ranking: any[] = [];

  constructor(private evaluappService: EvaluappService) { }

  ngOnInit(): void { }

  buscarRanking() {
    if (!this.fechaInicio || !this.fechaFin || !this.grupoSeleccionado) {
      alert('Por favor selecciona fechas y grupo.');
      return;
    }

    this.evaluappService.obtenerRanking(
      this.grupoSeleccionado,
      this.fechaInicio,
      this.fechaFin
    ).subscribe({
      next: data => {
        this.ranking = data;
      },
      error: err => {
        console.error('Error al obtener ranking:', err);
      }
    });
  }
}
