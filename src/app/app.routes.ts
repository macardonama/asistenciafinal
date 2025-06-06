import { Routes } from '@angular/router';
import { InicioComponent } from './inicio.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  {
    path: 'asistencia',
    loadComponent: () =>
      import('./attendance/attendance.component').then(m => m.AttendanceComponent)
  },
  {
    path: 'diario-aula',
    loadComponent: () =>
      import('./diario-aula/diario-aula.component').then(m => m.DiarioAulaComponent)
  },
  {
    path: 'evaluacion-estudiante',
    loadComponent: () =>
      import('./components/evaluacion-estudiante.component').then(m => m.EvaluacionEstudianteComponent)
  }
];
