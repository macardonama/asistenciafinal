import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluappService {
  private apiUrl = 'https://asistencia-server.onrender.com/respuestas/ranking';

  constructor(private http: HttpClient) {}

  obtenerRanking(grupo: string, fechaInicio: string, fechaFin: string): Observable<any> {
    let params = new HttpParams()
      .set('grupo', grupo)
      .set('fechainicio', fechaInicio)
      .set('fechafin', fechaFin);

    return this.http.get<any>(this.apiUrl, { params });
  }
}
