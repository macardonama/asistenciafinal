import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private apiUrl = 'https://asistencia-server.onrender.com/obtenerAsistencia';  // ✅ Aquí usamos tu ruta actual

  constructor(private http: HttpClient) {}

  getTodasAsistencias(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
