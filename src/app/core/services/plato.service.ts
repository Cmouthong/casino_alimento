import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plato, CategoriaPlato } from '../models/plato.model';

@Injectable({
  providedIn: 'root'
})
export class PlatoService {
  private apiUrl = 'http://localhost:8080/platos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<Plato> {
    return this.http.get<Plato>(`${this.apiUrl}/${id}`);
  }

  getByNombre(nombre: string): Observable<Plato> {
    return this.http.get<Plato>(`${this.apiUrl}/nombre/${nombre}`);
  }

  create(plato: Plato): Observable<Plato> {
    return this.http.post<Plato>(`${this.apiUrl}`, plato);
  }

  updateById(id: number, plato: Plato): Observable<Plato> {
    return this.http.put<Plato>(`${this.apiUrl}/id/${id}`, plato);
  }

  updateByNombre(nombre: string, plato: Plato): Observable<Plato> {
    return this.http.put<Plato>(`${this.apiUrl}/nombre/${nombre}`, plato);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/id/${id}`);
  }

  deleteByNombre(nombre: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/nombre/${nombre}`);
  }
} 