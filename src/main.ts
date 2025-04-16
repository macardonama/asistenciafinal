import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AttendanceComponent } from './app/attendance/attendance.component';

bootstrapApplication(AttendanceComponent, {
  providers: [provideHttpClient()]  // 🔹 Habilita HttpClient para la app
}).catch(err => console.error(err));
