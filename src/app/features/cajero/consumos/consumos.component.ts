import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsumoService } from '../../../core/services/consumo.service';
import { PlatoService } from '../../../core/services/plato.service';
import { ConsumidorService } from '../../../core/services/consumidor.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Consumo, ConsumoDTO } from '../../../core/models/consumo.model';
import { Plato } from '../../../core/models/plato.model';
import { Consumidor } from '../../../core/models/consumidor.model';

@Component({
  selector: 'app-consumos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <!-- Formulario de Búsqueda -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Buscar Consumidor</h5>
          <form [formGroup]="busquedaForm" (ngSubmit)="buscarConsumidor()">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="cedula">Cédula</label>
                  <input
                    type="text"
                    class="form-control"
                    id="cedula"
                    formControlName="cedula"
                    placeholder="Ingrese la cédula"
                  />
                </div>
              </div>
              <div class="col-md-6 d-flex align-items-end">
                <button type="submit" class="btn btn-primary" [disabled]="busquedaForm.invalid">
                  Buscar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Información del Consumidor -->
      <div class="card mb-4" *ngIf="consumidor">
        <div class="card-body">
          <div class="row">
            <div class="col-md-2">
              <img
                [src]="imagenUrl || 'assets/images/default-avatar.png'"
                class="img-fluid rounded"
                alt="Foto del consumidor"
              />
            </div>
            <div class="col-md-10">
              <h5 class="card-title">{{ consumidor.nombre }}</h5>
              <div class="mb-3">
                <strong>Nombre:</strong> {{ consumidor.nombre }}
              </div>
              <div class="mb-3">
                <strong>Teléfono:</strong> {{ consumidor.telefono }}
              </div>
              <div class="mb-3">
                <strong>Empresa:</strong> {{ getNombreEmpresa(consumidor.empresaNIT) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario de Consumo -->
      <div class="card mb-4" *ngIf="consumidor">
        <div class="card-body">
          <h5 class="card-title">Registrar Consumo</h5>
          <form [formGroup]="consumoForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-5">
                <div class="form-group">
                  <label for="plato">Plato</label>
                  <select
                    class="form-control"
                    id="plato"
                    formControlName="platoId"
                    (change)="onPlatoChange()"
                  >
                    <option [ngValue]="0">Seleccione un plato</option>
                    <option *ngFor="let plato of platos" [ngValue]="plato.id">
                      {{ plato.nombre }} - {{ plato.precio | currency }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label for="cantidad">Cantidad</label>
                  <input
                    type="number"
                    class="form-control"
                    id="cantidad"
                    formControlName="cantidad"
                    min="1"
                    (change)="calcularTotal()"
                  />
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label>Total</label>
                  <div class="form-control-plaintext">{{ total | currency }}</div>
                </div>
              </div>
              <div class="col-md-2 d-flex align-items-end">
                <button type="submit" class="btn btn-success" [disabled]="consumoForm.invalid">
                  Registrar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista de Consumos -->
      <div class="card" *ngIf="consumos.length > 0">
        <div class="card-body">
          <h5 class="card-title">Consumos Registrados</h5>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Plato</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let consumo of consumos">
                  <td>{{ consumo.fecha | date:'short' }}</td>
                  <td>{{ getPlatoNombre(consumo.platoId) }}</td>
                  <td>{{ consumo.cantidad }}</td>
                  <td>{{ getTotalConsumo(consumo) | currency }}</td>
                  <td>
                    <button class="btn btn-sm btn-danger" (click)="eliminarConsumo(consumo.id)">
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ConsumosComponent implements OnInit {
  busquedaForm: FormGroup;
  consumoForm: FormGroup;
  consumidor: Consumidor | null = null;
  consumos: Consumo[] = [];
  platos: Plato[] = [];
  total = 0;
  imagenUrl: string | null = null;

  constructor(
    private consumoService: ConsumoService,
    private platoService: PlatoService,
    private consumidorService: ConsumidorService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.busquedaForm = this.fb.group({
      cedula: ['', [Validators.required]]
    });

    this.consumoForm = this.fb.group({
      platoId: [0, [Validators.required, Validators.min(1)]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
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

  buscarConsumidor(): void {
    if (this.busquedaForm.invalid) {
      return;
    }

    const cedula = this.busquedaForm.get('cedula')?.value;

    this.consumidorService.getByCedula(cedula).subscribe({
      next: (consumidor) => {
        this.consumidor = consumidor;
        this.cargarConsumos();
        this.cargarImagen();
      },
      error: (error) => {
        this.notificationService.showError('Consumidor no encontrado');
        console.error('Error al buscar consumidor:', error);
        this.consumidor = null;
        this.consumos = [];
        this.imagenUrl = null;
      }
    });
  }

  cargarConsumos(): void {
    if (!this.consumidor) return;

    this.consumoService.getByEmpleado(this.consumidor.cedula).subscribe({
      next: (consumos) => {
        this.consumos = consumos;
      },
      error: (error) => {
        this.notificationService.showError('Error al cargar los consumos');
        console.error('Error al cargar consumos:', error);
      }
    });
  }

  cargarImagen(): void {
    if (!this.consumidor) return;

    this.consumidorService.getImagen(this.consumidor.cedula).subscribe({
      next: (blob) => {
        this.imagenUrl = URL.createObjectURL(blob);
      },
      error: (error) => {
        console.error('Error al cargar imagen:', error);
      }
    });
  }

  onPlatoChange(): void {
    this.calcularTotal();
  }

  calcularTotal(): void {
    const platoId = this.consumoForm.get('platoId')?.value || 0;
    const cantidad = this.consumoForm.get('cantidad')?.value || 0;
    const plato = this.platos.find(p => p.id === platoId);
    this.total = plato ? plato.precio * cantidad : 0;
  }

  onSubmit(): void {
    if (this.consumoForm.invalid || !this.consumidor) {
      return;
    }

    const formValue = this.consumoForm.value;
    if (!formValue.platoId || formValue.platoId <= 0) {
      this.notificationService.showError('Debe seleccionar un plato válido');
      return;
    }

    const consumoData: ConsumoDTO = {
      platoId: formValue.platoId,
      cantidad: formValue.cantidad,
      consumidorId: parseInt(this.consumidor.cedula),
      fecha: new Date(),
      monto: this.total
    };

    this.consumoService.create(consumoData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Consumo registrado exitosamente');
        this.consumoForm.reset({ platoId: 0, cantidad: 1 });
        this.total = 0;
        this.cargarConsumos();
      },
      error: (error) => {
        this.notificationService.showError('Error al registrar el consumo');
        console.error('Error al registrar consumo:', error);
      }
    });
  }

  eliminarConsumo(id: number | undefined): void {
    if (!id) {
      this.notificationService.showError('ID de consumo no válido');
      return;
    }

    if (confirm('¿Está seguro de eliminar este consumo?')) {
      this.consumoService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Consumo eliminado exitosamente');
          this.cargarConsumos();
        },
        error: (error) => {
          this.notificationService.showError('Error al eliminar el consumo');
          console.error('Error al eliminar consumo:', error);
        }
      });
    }
  }

  getPlatoNombre(platoId: number | undefined): string {
    if (!platoId) {
      return 'Plato no especificado';
    }
    const plato = this.platos.find(p => p.id === (platoId as number));
    return plato ? plato.nombre : 'Plato no encontrado';
  }

  getTotalConsumo(consumo: Consumo): number {
    if (!consumo) {
      console.warn('Consumo no válido');
      return 0;
    }

    if (consumo.platoId === undefined) {
      console.warn('platoId no especificado');
      return 0;
    }

    const plato = this.platos.find(p => p.id === consumo.platoId);
    if (!plato) {
      console.warn('Plato no encontrado para el ID:', consumo.platoId);
      return 0;
    }

    return plato.precio * consumo.cantidad;
  }

  getNombreEmpresa(empresaNIT: string | undefined): string {
    if (!empresaNIT) {
      return 'Empresa no especificada';
    }
    // Implementa la lógica para obtener el nombre de la empresa a partir del NIT
    return 'Nombre de la Empresa';
  }
} 