import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsumoService {
  private apiUrl = '/consumos';

  constructor(private http: HttpClient) {}

  // Obtener todos los consumos
  obtenerConsumos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Obtener consumos por empleado
  obtenerConsumosPorEmpleado(cedula: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empleado/${cedula}`);
  }

  // Obtener un consumo por ID
  obtenerConsumoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo consumo
  anadirConsumo(consumo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, consumo);
  }

  // Actualizar un consumo existente
  actualizarConsumo(id: number, consumo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, consumo);
  }

  // Eliminar un consumo
  eliminarConsumo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener el total de un consumo
  obtenerTotalConsumo(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/total`);
  }

  // Obtener un empleado por cédula
obtenerEmpleadoPorCedula(cedula: string): Observable<any> {
  return this.http.get<any>(`/empleados/${cedula}`);
}

}
