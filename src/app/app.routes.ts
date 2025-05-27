import { Routes } from '@angular/router';
import { DiarioAulaComponent } from './diario-aula/diario-aula.component';
import { AttendanceComponent } from './attendance/attendance.component';

export const routes: Routes = [
  { path: '', redirectTo: 'attendance', pathMatch: 'full' },
  { path: 'attendance', component: AttendanceComponent },
  { path: 'diario-aula', component: DiarioAulaComponent },
];
