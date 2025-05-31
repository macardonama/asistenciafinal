import { Routes } from '@angular/router';
import { InicioComponent } from './inicio.component';
import { DiarioAulaComponent } from './diario-aula/diario-aula.component';
import { AttendanceComponent } from './attendance/attendance.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'attendance', component: AttendanceComponent },
  { path: 'diario-aula', component: DiarioAulaComponent },
  {
  path: 'evaluacion-estudiante',
  loadComponent: () => import('./components/evaluacion-estudiante.component').then(m => m.EvaluacionEstudianteComponent)
}
];
