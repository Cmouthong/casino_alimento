import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlatoService {
  private apiUrl = '/platos'; // Utiliza el proxy configurado para redirigir al backend

  constructor(private http: HttpClient) {}

  // Obtener todos los platos
  obtenerTodosLosPlatos(): Observable<any[]> {
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

  // Actualizar un plato por su ID
  actualizarPlato(id: number, detallesPlato: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/id/${id}`, detallesPlato);
  }

  // Actualizar un plato por su nombre
  actualizarPlatoPorNombre(nombre: string, detallesPlato: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/nombre/${nombre}`, detallesPlato);
  }

  // Eliminar un plato por su ID
  eliminarPlato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/id/${id}`);
  }

  // Eliminar un plato por su nombre
  eliminarPlatoPorNombre(nombre: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/nombre/${nombre}`);
  }
}