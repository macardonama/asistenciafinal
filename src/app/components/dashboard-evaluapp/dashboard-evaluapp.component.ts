import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluappService } from '../../services/evaluapp.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-evaluapp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [EvaluappService],  // ✅ agregamos el servicio aquí
  templateUrl: './dashboard-evaluapp.component.html',
  styleUrls: ['./dashboard-evaluapp.component.css']
})
export class DashboardEvaluappComponent implements OnInit {

  grupoSeleccionado: string = '4-3';
  fechaInicio: string = '';
  fechaFin: string = '';
  ranking: any[] = [];

  private evaluappService = inject(EvaluappService);  // ✅ inyectado correctamente para standalone

  ngOnInit(): void { }

  buscarRanking(): void {
    if (!this.fechaInicio || !this.fechaFin || !this.grupoSeleccionado) {
      alert('Por favor selecciona fechas y grupo.');
      return;
    }

    this.evaluappService.obtenerRanking(
      this.grupoSeleccionado,
      this.fechaInicio,
      this.fechaFin
    ).subscribe({
      next: (data: any) => {
        this.ranking = data;
      },
      error: (err: any) => {
        console.error('Error al obtener ranking:', err);
      }
    });
  }
}
