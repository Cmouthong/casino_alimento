import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsumoService } from '../../../core/services/consumo.service';
import { PlatoService } from '../../../core/services/plato.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Consumo } from '../../../core/models/consumo.model';
import { Plato } from '../../../core/models/plato.model';

interface ReporteConsumo {
  fecha: Date;
  consumidorId: number;
  platoNombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h2>Reportes de Consumos</h2>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <form [formGroup]="filtroForm" (ngSubmit)="generarReporte()">
            <div class="row g-3">
              <div class="col-md-4">
                <label for="fechaInicio" class="form-label">Fecha Inicio</label>
                <input
                  type="date"
                  class="form-control"
                  id="fechaInicio"
                  formControlName="fechaInicio"
                >
              </div>

              <div class="col-md-4">
                <label for="fechaFin" class="form-label">Fecha Fin</label>
                <input
                  type="date"
                  class="form-control"
                  id="fechaFin"
                  formControlName="fechaFin"
                >
              </div>

              <div class="col-md-4">
                <label for="categoria" class="form-label">Categoría</label>
                <select
                  class="form-select"
                  id="categoria"
                  formControlName="categoria"
                >
                  <option value="">Todas las categorías</option>
                  <option value="ENTRADA">Entrada</option>
                  <option value="PRINCIPAL">Plato Principal</option>
                  <option value="POSTRE">Postre</option>
                  <option value="BEBIDA">Bebida</option>
                </select>
              </div>

              <div class="col-12">
                <button type="submit" class="btn btn-primary">
                  Generar Reporte
                </button>
                <button type="button" class="btn btn-secondary ms-2" (click)="exportarPDF()" [disabled]="!reporteGenerado">
                  Exportar a PDF
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Resumen -->
      <div class="row mb-4" *ngIf="reporteGenerado">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Total Consumos</h5>
              <p class="card-text display-6">{{ totalConsumos }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Total Ingresos</h5>
              <p class="card-text display-6">{{ totalIngresos | currency }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Promedio por Consumo</h5>
              <p class="card-text display-6">{{ promedioPorConsumo | currency }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Reporte -->
      <div class="table-responsive" *ngIf="reporteGenerado">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Consumidor</th>
              <th>Plato</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of reporte">
              <td>{{ item.fecha | date:'short' }}</td>
              <td>{{ item.consumidorId }}</td>
              <td>{{ item.platoNombre }}</td>
              <td>{{ item.cantidad }}</td>
              <td>{{ item.precioUnitario | currency }}</td>
              <td>{{ item.total | currency }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ReportesComponent implements OnInit {
  filtroForm: FormGroup;
  consumos: Consumo[] = [];
  platos: Plato[] = [];
  reporte: ReporteConsumo[] = [];
  reporteGenerado = false;
  totalConsumos = 0;
  totalIngresos = 0;
  promedioPorConsumo = 0;

  constructor(
    private consumoService: ConsumoService,
    private platoService: PlatoService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      categoria: ['']
    });
  }

  ngOnInit(): void {
    this.cargarPlatos();
  }

  cargarPlatos(): void {
    this.platoService.getAll().subscribe({
      next: (platos) => {
        this.platos = platos;
      },
      error: (error) => {
        this.notificationService.showError('Error al cargar los platos');
        console.error('Error al cargar platos:', error);
      }
    });
  }

  generarReporte(): void {
    if (this.filtroForm.invalid) {
      return;
    }

    const { fechaInicio, fechaFin, categoria } = this.filtroForm.value;

    this.consumoService.getAll().subscribe({
      next: (consumos) => {
        // Filtrar consumos por fecha
        this.consumos = consumos.filter(consumo => {
          const fechaConsumo = new Date(consumo.fecha);
          return fechaConsumo >= new Date(fechaInicio) && 
                 fechaConsumo <= new Date(fechaFin);
        });

        // Generar reporte
        this.reporte = this.consumos.map(consumo => {
          const plato = this.platos.find(p => p.id === consumo.platoId);
          return {
            fecha: new Date(consumo.fecha),
            consumidorId: consumo.consumidorId,
            platoNombre: plato?.nombre || 'Plato no encontrado',
            cantidad: consumo.cantidad,
            precioUnitario: plato?.precio || 0,
            total: (plato?.precio || 0) * consumo.cantidad
          };
        });

        // Filtrar por categoría si se especificó
        if (categoria) {
          this.reporte = this.reporte.filter(item => {
            const plato = this.platos.find(p => p.nombre === item.platoNombre);
            return plato?.categoria === categoria;
          });
        }

        // Calcular totales
        this.totalConsumos = this.reporte.length;
        this.totalIngresos = this.reporte.reduce((sum, item) => sum + item.total, 0);
        this.promedioPorConsumo = this.totalConsumos > 0 ? this.totalIngresos / this.totalConsumos : 0;

        this.reporteGenerado = true;
      },
      error: (error) => {
        this.notificationService.showError('Error al generar el reporte');
        console.error('Error al generar reporte:', error);
      }
    });
  }

  exportarPDF(): void {
    if (!this.reporteGenerado) {
      return;
    }

    const { fechaInicio, fechaFin, categoria } = this.filtroForm.value;

    this.consumoService.getReportePDF(fechaInicio, fechaFin, categoria).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_consumos_${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.notificationService.showError('Error al descargar el reporte PDF');
        console.error('Error al descargar PDF:', error);
      }
    });
  }
} 