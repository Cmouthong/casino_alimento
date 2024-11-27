import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlatoService {
  private apiUrl = '/platos';

  constructor(private http: HttpClient) {}

  // Obtener todos los platos
  obtenerPlatos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Obtener un plato por su ID
  obtenerPlatoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`);
  }

  // Obtener un plato por su nombre
  obtenerPlatoPorNombre(nombre: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nombre/${nombre}`);
  }

  // Añadir un nuevo plato
  anadirPlato(plato: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, plato);
  }

  // Actualizar un plato por ID
  actualizarPlato(id: number, plato: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/id/${id}`, plato);
  }

  // Actualizar un plato por Nombre
  actualizarPlatoPorNombre(nombre: string, plato: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/nombre/${nombre}`, plato);
  }

  // Eliminar un plato por ID
  eliminarPlato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/id/${id}`);
  }

  // Eliminar un plato por Nombre
  eliminarPlatoPorNombre(nombre: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/nombre/${nombre}`);
  }
}