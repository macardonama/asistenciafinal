import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiarioAulaService {
  private apiUrl = 'https://asistencia-server.onrender.com';

  constructor(private http: HttpClient) {}

  filtrarDiarioAula(grupo: string, fechainicio: string, fechafin: string): Observable<any[]> {
    const params = new HttpParams()
      .set('grupo', grupo)
      .set('fechainicio', fechainicio)
      .set('fechafin', fechafin);

    return this.http.get<any[]>(`${this.apiUrl}/diario-aula/filtrar`, { params });
  }
}
