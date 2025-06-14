import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsumoService } from '../../../core/services/consumo.service';
import { PlatoService } from '../../../core/services/plato.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Consumo } from '../../../core/models/consumo.model';
import { ConsumoDTO } from '../../../core/models/consumo.model';
import { Plato } from '../../../core/models/plato.model';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-consumos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h2>Mis Consumos</h2>
        </div>
      </div>

      <!-- Formulario de Nuevo Consumo -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Nuevo Consumo</h5>
          <form [formGroup]="consumoForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="plato" class="form-label">Plato</label>
                <select
                  class="form-select"
                  id="plato"
                  formControlName="platoId"
                  (change)="onPlatoChange()"
                >
                  <option value="">Seleccione un plato</option>
                  <option *ngFor="let plato of platos" [value]="plato.id">
                    {{ plato.nombre }} - {{ plato.precio | currency }}
                  </option>
                </select>
                <div *ngIf="consumoForm.get('platoId')?.invalid && consumoForm.get('platoId')?.touched" class="text-danger">
                  Por favor seleccione un plato
                </div>
              </div>

              <div class="col-md-6">
                <label for="cantidad" class="form-label">Cantidad</label>
                <input
                  type="number"
                  class="form-control"
                  id="cantidad"
                  formControlName="cantidad"
                  min="1"
                  (input)="calcularTotal()"
                >
                <div *ngIf="consumoForm.get('cantidad')?.invalid && consumoForm.get('cantidad')?.touched" class="text-danger">
                  La cantidad debe ser mayor a 0
                </div>
              </div>

              <div class="col-12">
                <div class="alert alert-info" *ngIf="total > 0">
                  Total: {{ total | currency }}
                </div>
              </div>

              <div class="col-12">
                <button type="submit" class="btn btn-primary" [disabled]="consumoForm.invalid">
                  Registrar Consumo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Historial de Consumos -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Historial de Consumos</h5>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Plato</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let consumo of misConsumos">
                  <td>{{ consumo.fecha | date:'short' }}</td>
                  <td>{{ getPlatoNombre(consumo.platoId) }}</td>
                  <td>{{ consumo.cantidad }}</td>
                  <td>{{ getTotalConsumo(consumo) | currency }}</td>
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
export class ConsumosComponent implements OnInit, OnDestroy {
  consumoForm: FormGroup;
  platos: Plato[] = [];
  misConsumos: Consumo[] = [];
  total = 0;
  currentUser: User | null = null;

  constructor(
    private consumoService: ConsumoService,
    private platoService: PlatoService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.consumoForm = this.fb.group({
      platoId: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.cargarMisConsumos();
      }
    });
    this.cargarPlatos();
  }

  ngOnDestroy(): void {
    // Cleanup code if needed
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

  cargarMisConsumos(): void {
    if (!this.currentUser) return;

    this.consumoService.getByEmpleado(this.currentUser.cedula).subscribe({
      next: (consumos) => {
        this.misConsumos = consumos;
      },
      error: (error) => {
        this.notificationService.showError('Error al cargar tus consumos');
        console.error('Error al cargar consumos:', error);
      }
    });
  }

  onPlatoChange(): void {
    this.calcularTotal();
  }

  calcularTotal(): void {
    const platoId = this.consumoForm.get('platoId')?.value;
    const cantidad = this.consumoForm.get('cantidad')?.value || 0;
    const plato = this.platos.find(p => p.id === platoId);
    this.total = plato ? plato.precio * cantidad : 0;
  }

  onSubmit(): void {
    if (this.consumoForm.invalid || !this.currentUser) {
      return;
    }

    const formValue = this.consumoForm.value;
    const consumo: ConsumoDTO = {
      platoId: formValue.platoId,
      cantidad: formValue.cantidad,
      consumidorId: parseInt(this.currentUser.cedula),
      fecha: new Date(),
      monto: this.total
    };

    this.consumoService.create(consumo).subscribe({
      next: () => {
        this.notificationService.showSuccess('Consumo registrado exitosamente');
        this.consumoForm.reset({ cantidad: 1 });
        this.total = 0;
        this.cargarMisConsumos();
      },
      error: (error) => {
        this.notificationService.showError('Error al registrar el consumo');
        console.error('Error al registrar consumo:', error);
      }
    });
  }

  getPlatoNombre(platoId: number | undefined): string {
    if (!platoId) {
      return 'Plato no especificado';
    }
    const plato = this.platos.find(p => p.id === platoId);
    return plato ? plato.nombre : 'Plato no encontrado';
  }

  getTotalConsumo(consumo: Consumo): number {
    if (!consumo.platoId) {
      return 0;
    }
    const plato = this.platos.find(p => p.id === consumo.platoId);
    return plato ? plato.precio * consumo.cantidad : 0;
  }
} 