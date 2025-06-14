import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Consumo, ConsumoDTO } from '../models/consumo.model';

@Injectable({
  providedIn: 'root'
})
export class ConsumoService {
  constructor(private http: HttpClient) {}

  private transformConsumo(consumo: Consumo): Consumo {
    return {
      ...consumo,
      platoId: Number(consumo.platoId) || 0
    };
  }

  getAll(): Observable<Consumo[]> {
    return this.http.get<Consumo[]>('/consumos').pipe(
      map(consumos => consumos.map(this.transformConsumo))
    );
  }

  getById(id: number): Observable<Consumo> {
    return this.http.get<Consumo>(`/consumos/${id}`).pipe(
      map(this.transformConsumo)
    );
  }

  getByEmpleado(cedula: string): Observable<Consumo[]> {
    return this.http.get<Consumo[]>(`/consumos/empleado/${cedula}`).pipe(
      map(consumos => consumos.map(this.transformConsumo))
    );
  }

  getTotal(id: number): Observable<number> {
    return this.http.get<number>(`/consumos/${id}/total`);
  }

  create(consumo: ConsumoDTO): Observable<Consumo> {
    return this.http.post<Consumo>('/consumos', consumo).pipe(
      map(this.transformConsumo)
    );
  }

  update(id: number, consumo: ConsumoDTO): Observable<Consumo> {
    return this.http.put<Consumo>(`/consumos/${id}`, consumo).pipe(
      map(this.transformConsumo)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/consumos/${id}`);
  }

  getReportePDF(fechaInicio: string, fechaFin: string, categoria?: string): Observable<Blob> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    
    if (categoria) {
      params = params.set('categoria', categoria);
    }

    return this.http.get(`/consumos/reporte/pdf`, {
      params,
      responseType: 'blob'
    });
  }
} 