import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Empresa } from '../models/empresa.model';
  
@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = environment.apiUrl + '/empresas';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>('/empresas');
  }

  getByNit(nit: string): Observable<Empresa> {
    return this.http.get<Empresa>(`/empresas/${nit}`);
  }

  create(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(`${this.apiUrl}`, empresa);
  }

  update(nit: string, empresa: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`/empresas/${nit}`, empresa);
  }

  delete(nit: string): Observable<void> {
    return this.http.delete<void>(`/empresas/${nit}`);
  }
} 