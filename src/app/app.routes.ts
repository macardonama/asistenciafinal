import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/diario-aula',
    pathMatch: 'full'
  },
  {
    path: 'diario-aula',
    loadComponent: () =>
      import('./diario-aula/diario-aula.component').then(m => m.DiarioAulaComponent)
  },
  {
    path: 'asistencia',
    loadComponent: () =>
      import('./attendance/attendance.component').then(m => m.AttendanceComponent)
  }
];
