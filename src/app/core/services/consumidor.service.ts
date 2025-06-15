import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Consumidor, ConsumidorResponseDTO } from '../models/consumidor.model';

@Injectable({
  providedIn: 'root'
})
export class ConsumidorService {
  private apiUrl = `${environment.apiUrl}/consumidores`;
  private adminApiUrl = `${environment.apiUrl}/admin/consumidores`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Consumidor[]> {
    return this.http.get<Consumidor[]>(this.apiUrl);
  }

  getByCedula(cedula: string): Observable<Consumidor> {
    return this.http.get<Consumidor>(`${this.apiUrl}/${cedula}`);
  }

  create(consumidor: FormData): Observable<ConsumidorResponseDTO> {
    return this.http.post<ConsumidorResponseDTO>(this.adminApiUrl, consumidor);
  }

  update(cedula: string, consumidor: FormData): Observable<Consumidor> {
    return this.http.put<Consumidor>(`${this.adminApiUrl}/${cedula}`, consumidor);
  }

  delete(cedula: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${cedula}`);
  }

  getImagen(cedula: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${cedula}/imagen`, { responseType: 'blob' });
  }

  subirImagen(cedula: string, imagen: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post(`${this.apiUrl}/${cedula}/subirImagen`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  modificarImagen(cedula: string, imagen: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post(`${this.apiUrl}/${cedula}/modificarImagen`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  eliminarImagen(cedula: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cedula}/eliminarImagen`);
  }
} 