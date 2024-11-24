import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsumoService {
  private apiUrl = '/consumos'; // Asegúrate de que coincida con la configuración de tu backend

  constructor(private http: HttpClient) {}

  // Obtener todos los consumos
  obtenerConsumos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Registrar un nuevo consumo
  registrarConsumo(consumo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, consumo);
  }

  // Obtener un consumo por ID
  obtenerConsumoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Eliminar un consumo
  eliminarConsumo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}