import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Consumidor {
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  imagen?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsumidorService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Consumidor[]> {
    return this.http.get<Consumidor[]>('/consumidores');
  }

  getByCedula(cedula: string): Observable<Consumidor> {
    return this.http.get<Consumidor>(`/consumidores/${cedula}`);
  }

  create(consumidor: Consumidor, imagen?: File): Observable<Consumidor> {
    const formData = new FormData();
    formData.append('consumidor', JSON.stringify(consumidor));
    if (imagen) {
      formData.append('imagen', imagen);
    }
    return this.http.post<Consumidor>('/consumidores', formData);
  }

  update(cedula: string, consumidor: Consumidor): Observable<Consumidor> {
    return this.http.put<Consumidor>(`/consumidores/${cedula}`, consumidor);
  }

  delete(cedula: string): Observable<void> {
    return this.http.delete<void>(`/consumidores/${cedula}`);
  }

  getImagen(cedula: string): Observable<Blob> {
    return this.http.get(`/consumidores/${cedula}/imagen`, { responseType: 'blob' });
  }

  subirImagen(cedula: string, imagen: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post(`/consumidores/${cedula}/subirImagen`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  modificarImagen(cedula: string, imagen: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post(`/consumidores/${cedula}/modificarImagen`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  eliminarImagen(cedula: string): Observable<void> {
    return this.http.delete<void>(`/consumidores/${cedula}/eliminarImagen`);
  }
} 