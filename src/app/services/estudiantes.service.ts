import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estudiante {
  nombre_estudiante: string;
  grupo: string;
}

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  private apiUrl = 'https://asistencia-server.onrender.com/api/estudiantes';

  constructor(private http: HttpClient) {}

  obtenerEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }
}
