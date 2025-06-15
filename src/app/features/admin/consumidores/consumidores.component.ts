import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsumidorService } from '../../../core/services/consumidor.service';
import { EmpresaService } from '../../../core/services/empresa.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Consumidor } from '../../../core/models/consumidor.model';
import { Empresa } from '../../../core/models/empresa.model';

@Component({
  selector: 'app-consumidores',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h2>Gestión de Consumidores</h2>
        </div>
        <div class="col-auto">
          <button class="btn btn-primary" (click)="mostrarFormulario()">
            Nuevo Consumidor
          </button>
        </div>
      </div>

      <!-- Formulario de Consumidor -->
      <div class="card mb-4" *ngIf="mostrarForm">
        <div class="card-body">
          <h5 class="card-title">{{ consumidorForm.get('cedula')?.value ? 'Editar' : 'Nuevo' }} Consumidor</h5>
          <form [formGroup]="consumidorForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="cedula" class="form-label">Cédula</label>
                <input
                  type="text"
                  class="form-control"
                  id="cedula"
                  formControlName="cedula"
                >
                <div class="invalid-feedback" *ngIf="consumidorForm.get('cedula')?.errors?.['required'] && consumidorForm.get('cedula')?.touched">
                  La cédula es requerida
                </div>
              </div>

              <div class="col-md-6">
                <label for="nombre" class="form-label">Nombre</label>
                <input
                  type="text"
                  class="form-control"
                  id="nombre"
                  formControlName="nombre"
                >
                <div class="invalid-feedback" *ngIf="consumidorForm.get('nombre')?.errors?.['required'] && consumidorForm.get('nombre')?.touched">
                  El nombre es requerido
                </div>
              </div>

              <div class="col-md-6">
                <label for="telefono" class="form-label">Teléfono</label>
                <input
                  type="text"
                  class="form-control"
                  id="telefono"
                  formControlName="telefono"
                >
                <div class="invalid-feedback" *ngIf="consumidorForm.get('telefono')?.errors?.['required'] && consumidorForm.get('telefono')?.touched">
                  El teléfono es requerido
                </div>
              </div>

              <div class="col-md-6">
                <label for="empresaNIT" class="form-label">Empresa</label>
                <select
                  class="form-select"
                  id="empresaNIT"
                  formControlName="empresaNIT"
                >
                  <option value="">Seleccione una empresa</option>
                  <option *ngFor="let empresa of empresas" [value]="empresa.nit">
                    {{ empresa.nombre }} - {{ empresa.nit }}
                  </option>
                </select>
                <div class="invalid-feedback" *ngIf="consumidorForm.get('empresaNIT')?.errors?.['required'] && consumidorForm.get('empresaNIT')?.touched">
                  La empresa es requerida
                </div>
              </div>

              <div class="col-md-6">
                <label for="imagen" class="form-label">Imagen</label>
                <input
                  type="file"
                  class="form-control"
                  id="imagen"
                  (change)="onFileSelected($event)"
                  accept="image/*"
                >
                <div class="invalid-feedback" *ngIf="!imagenSeleccionada && !consumidorForm.get('cedula')?.value">
                  La imagen es requerida
                </div>
              </div>

              <div class="col-12">
                <button type="button" class="btn btn-primary" (click)="onSubmit()">
                  {{ consumidorForm.get('cedula')?.value ? 'Actualizar' : 'Crear' }}
                </button>
                <button type="button" class="btn btn-secondary ms-2" (click)="cancelar()">
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Tabla de Consumidores -->
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Empresa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let consumidor of consumidores">
              <td>
                <img *ngIf="consumidor.rutaImagen"
                     [src]="consumidor.rutaImagen"
                     alt="Foto"
                     width="48"
                     height="48"
                     style="object-fit:cover; border-radius:50%; cursor:pointer;"
                     (click)="abrirModalImagen(consumidor.rutaImagen)" />
                <span *ngIf="!consumidor.rutaImagen">Sin foto</span>
              </td>
              <td>{{ consumidor.cedula }}</td>
              <td>{{ consumidor.nombre }}</td>
              <td>{{ consumidor.telefono }}</td>
              <td>{{ getNombreEmpresa(consumidor.empresaNIT) }}</td>
              <td>
                <button class="btn btn-sm btn-primary me-2" (click)="editarConsumidor(consumidor)">
                  Editar
                </button>
                <button class="btn btn-sm btn-danger" (click)="confirmarEliminacion(consumidor)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal de imagen -->
      <div class="modal fade show" tabindex="-1" [ngStyle]="{display: modalImagenAbierto ? 'block' : 'none', background: 'rgba(0,0,0,0.5)'}" *ngIf="modalImagenAbierto">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body text-center">
              <img [src]="modalImagenUrl" alt="Foto grande" style="max-width:100%; max-height:70vh;">
            </div>
            <div class="modal-footer justify-content-center">
              <button type="button" class="btn btn-secondary" (click)="cerrarModalImagen()">Cerrar</button>
            </div>
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
export class ConsumidoresComponent implements OnInit {
  consumidores: Consumidor[] = [];
  empresas: Empresa[] = [];
  consumidorForm: FormGroup;
  mostrarForm = false;
  imagenSeleccionada: File | null = null;
  modalImagenAbierto = false;
  modalImagenUrl: string | null = null;

  constructor(
    private consumidorService: ConsumidorService,
    private empresaService: EmpresaService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.consumidorForm = this.fb.group({
      cedula: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      empresaNIT: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarConsumidores();
    this.cargarEmpresas();
  }

  cargarConsumidores(): void {
    this.consumidorService.getAll().subscribe({
      next: (consumidores) => {
        this.consumidores = consumidores;
      },
      error: (error) => {
        this.notificationService.showError('Error al cargar los consumidores');
        console.error('Error al cargar consumidores:', error);
      }
    });
  }

  cargarEmpresas(): void {
    this.empresaService.getAll().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
      },
      error: (error) => {
        this.notificationService.showError('Error al cargar las empresas');
        console.error('Error al cargar empresas:', error);
      }
    });
  }

  getNombreEmpresa(nit: string): string {
    const empresa = this.empresas.find(e => e.nit === nit);
    return empresa ? empresa.nombre : nit;
  }

  mostrarFormulario(): void {
    if (!this.consumidorForm.get('cedula')?.value) {
      this.consumidorForm.reset();
      this.imagenSeleccionada = null;
    }
    this.mostrarForm = true;
  }

  editarConsumidor(consumidor: Consumidor): void {
    this.consumidorForm.patchValue(consumidor);
    this.imagenSeleccionada = null;
    this.mostrarForm = true;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  onSubmit(): void {
    if (this.consumidorForm.invalid) {
      return;
    }
    const consumidor = this.consumidorForm.value;
    if (this.editando()) {
      this.editarConsumidorSubmit(consumidor);
    } else {
      this.crearConsumidorSubmit(consumidor);
    }
  }

  private crearConsumidorSubmit(consumidor: any): void {
    if (this.consumidores.some(c => c.cedula === consumidor.cedula)) {
      this.notificationService.showError('Ya existe un consumidor con esa cédula.');
      return;
    }
    const formData = new FormData();
    formData.append('cedula', consumidor.cedula);
    formData.append('nombre', consumidor.nombre);
    formData.append('telefono', consumidor.telefono);
    formData.append('empresaNIT', consumidor.empresaNIT);
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    } else {
      this.notificationService.showError('La imagen es requerida');
      return;
    }
    this.consumidorService.create(formData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Consumidor creado exitosamente');
        this.cargarConsumidores();
        this.cancelar();
      },
      error: (error) => {
        this.notificationService.showError('Error al crear el consumidor');
        console.error('Error al crear consumidor:', error);
      }
    });
  }

  private editarConsumidorSubmit(consumidor: any): void {
    const formData = new FormData();
    formData.append('cedula', consumidor.cedula);
    formData.append('nombre', consumidor.nombre);
    formData.append('telefono', consumidor.telefono);
    formData.append('empresaNIT', consumidor.empresaNIT);
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }
    this.consumidorService.update(consumidor.cedula, formData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Consumidor actualizado exitosamente');
        this.cargarConsumidores();
        this.cancelar();
      },
      error: (error) => {
        this.notificationService.showError('Error al actualizar el consumidor');
        console.error('Error al actualizar consumidor:', error);
      }
    });
  }

  private editando(): boolean {
    const cedula = this.consumidorForm.get('cedula')?.value;
    return !!cedula && this.consumidores.some(c => c.cedula === cedula);
  }

  confirmarEliminacion(consumidor: Consumidor): void {
    if (confirm(`¿Está seguro de eliminar al consumidor ${consumidor.nombre}?`)) {
      this.eliminarConsumidor(consumidor.cedula);
    }
  }

  eliminarConsumidor(cedula: string): void {
    this.consumidorService.delete(cedula).subscribe({
      next: () => {
        this.notificationService.showSuccess('Consumidor eliminado exitosamente');
        this.cargarConsumidores();
      },
      error: (error) => {
        this.notificationService.showError('Error al eliminar el consumidor');
        console.error('Error al eliminar consumidor:', error);
      }
    });
  }

  cancelar(): void {
    this.consumidorForm.reset();
    this.imagenSeleccionada = null;
    this.mostrarForm = false;
  }

  abrirModalImagen(ruta: string) {
    this.modalImagenUrl = ruta;
    this.modalImagenAbierto = true;
  }

  cerrarModalImagen() {
    this.modalImagenAbierto = false;
    this.modalImagenUrl = null;
  }
} 