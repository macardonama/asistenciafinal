import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EvaluappService } from '../../services/evaluapp.service';

@Component({
  selector: 'app-dashboard-evaluapp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [EvaluappService],
  templateUrl: './dashboard-evaluapp.component.html',
  styleUrls: ['./dashboard-evaluapp.component.css']
})
export class DashboardEvaluappComponent {

  grupos: string[] = ['4-1', '4-2', '4-3', '4-4', 'Todos'];
  grupoSeleccionado: string = 'Todos';
  fechaInicio: string = '';
  fechaFin: string = '';
  podio: any[] = [];

  constructor(private evaluappService: EvaluappService) {}

  buscar(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Selecciona un rango de fechas');
      return;
    }
    this.evaluappService.obtenerRanking(this.grupoSeleccionado, this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (data: any) => {
          this.podio = data.slice(0, 3);
        },
        error: (err: any) => {
          console.error('Error al obtener ranking:', err);
        }
      });
  }
}
