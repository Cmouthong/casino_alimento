import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlatoService } from '../../../core/services/plato.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Plato } from '../../../core/models/plato.model';

@Component({
  selector: 'app-platos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h2>Gestión de Platos</h2>
        </div>
        <div class="col-auto">
          <button class="btn btn-primary" (click)="mostrarFormulario()">
            Nuevo Plato
          </button>
        </div>
      </div>

      <!-- Formulario de Plato -->
      <div class="card mb-4" *ngIf="mostrarForm">
        <div class="card-body">
          <h5 class="card-title">{{ platoForm.get('id')?.value ? 'Editar' : 'Nuevo' }} Plato</h5>
          <form [formGroup]="platoForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="nombre" class="form-label">Nombre</label>
                <input
                  type="text"
                  class="form-control"
                  id="nombre"
                  formControlName="nombre"
                >
                <div class="invalid-feedback" *ngIf="platoForm.get('nombre')?.errors?.['required'] && platoForm.get('nombre')?.touched">
                  El nombre es requerido
                </div>
              </div>

              <div class="col-md-6">
                <label for="precio" class="form-label">Precio</label>
                <input
                  type="number"
                  class="form-control"
                  id="precio"
                  formControlName="precio"
                  min="0"
                  step="0.01"
                >
                <div class="invalid-feedback" *ngIf="platoForm.get('precio')?.errors?.['required'] && platoForm.get('precio')?.touched">
                  El precio es requerido
                </div>
              </div>

              <div class="col-md-6">
                <label for="categoria" class="form-label">Categoría</label>
                <select
                  class="form-select"
                  id="categoria"
                  formControlName="categoria"
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="ENTRADA">Entrada</option>
                  <option value="PRINCIPAL">Plato Principal</option>
                  <option value="POSTRE">Postre</option>
                  <option value="BEBIDA">Bebida</option>
                </select>
                <div class="invalid-feedback" *ngIf="platoForm.get('categoria')?.errors?.['required'] && platoForm.get('categoria')?.touched">
                  La categoría es requerida
                </div>
              </div>

              <div class="col-md-6">
                <label for="descripcion" class="form-label">Descripción</label>
                <textarea
                  class="form-control"
                  id="descripcion"
                  formControlName="descripcion"
                  rows="3"
                ></textarea>
                <div class="invalid-feedback" *ngIf="platoForm.get('descripcion')?.errors?.['required'] && platoForm.get('descripcion')?.touched">
                  La descripción es requerida
                </div>
              </div>

              <div class="col-12">
                <button type="submit" class="btn btn-primary" [disabled]="platoForm.invalid">
                  {{ platoForm.get('id')?.value ? 'Actualizar' : 'Crear' }}
                </button>
                <button type="button" class="btn btn-secondary ms-2" (click)="cancelar()">
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Tabla de Platos -->
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let plato of platos">
              <td>{{ plato.id }}</td>
              <td>{{ plato.nombre }}</td>
              <td>{{ plato.descripcion }}</td>
              <td>{{ plato.precio | currency }}</td>
              <td>{{ plato.categoria }}</td>
              <td>
                <button class="btn btn-sm btn-primary me-2" (click)="editarPlato(plato)">
                  Editar
                </button>
                <button class="btn btn-sm btn-danger" (click)="eliminarPlato(plato.id)">
                  Eliminar
                </button>
              </td>
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
export class PlatosComponent implements OnInit {
  platos: Plato[] = [];
  platoForm: FormGroup;
  mostrarForm = false;

  constructor(
    private platoService: PlatoService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.platoForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', [Validators.required]]
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

  mostrarFormulario(): void {
    this.platoForm.reset();
    this.mostrarForm = true;
  }

  editarPlato(plato: Plato): void {
    this.platoForm.patchValue({
      id: plato.id,
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      precio: plato.precio,
      categoria: plato.categoria
    });
    this.mostrarForm = true;
  }

  eliminarPlato(id: number): void {
    if (confirm('¿Está seguro de eliminar este plato?')) {
      this.platoService.deleteById(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Plato eliminado exitosamente');
          this.cargarPlatos();
        },
        error: (error) => {
          this.notificationService.showError('Error al eliminar el plato');
          console.error('Error al eliminar plato:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.platoForm.invalid) {
      return;
    }

    const plato: Plato = this.platoForm.value;
    const id = plato.id;

    if (id) {
      // Actualizar plato existente
      this.platoService.updateById(id, plato).subscribe({
        next: () => {
          this.notificationService.showSuccess('Plato actualizado exitosamente');
          this.cargarPlatos();
          this.cancelar();
        },
        error: (error) => {
          this.notificationService.showError('Error al actualizar el plato');
          console.error('Error al actualizar plato:', error);
        }
      });
    } else {
      // Crear nuevo plato
      this.platoService.create(plato).subscribe({
        next: () => {
          this.notificationService.showSuccess('Plato creado exitosamente');
          this.cargarPlatos();
          this.cancelar();
        },
        error: (error) => {
          this.notificationService.showError('Error al crear el plato');
          console.error('Error al crear plato:', error);
        }
      });
    }
  }

  cancelar(): void {
    this.platoForm.reset();
    this.mostrarForm = false;
  }
} 