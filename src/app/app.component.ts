import { Component } from '@angular/core';
import { AttendanceComponent } from './attendance/attendance.component'; // 👈 Importa el componente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AttendanceComponent], // 👈 Asegura que el componente esté aquí
  template: `<app-attendance></app-attendance>` // 👈 Renderiza el componente
})
export class AppComponent {}
