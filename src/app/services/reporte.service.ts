import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private apiUrl = 'http://localhost:3000/api/reportes';  // Ruta de la API

  constructor(private http: HttpClient) { }

  // Método para crear un nuevo reporte e incidente
  createReporte(reporte: any, incidente: any): Observable<any> {
    const body = { reporte, incidente };
    return this.http.post(this.apiUrl, body);
  }
}
