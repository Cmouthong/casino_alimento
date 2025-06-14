import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from '../../../core/services/empresa.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Empresa } from '../../../core/models/empresa.model';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h2>Gestión de Empresas</h2>
        </div>
        <div class="col-auto">
          <button class="btn btn-primary" (click)="mostrarFormulario()">
            Nueva Empresa
          </button>
        </div>
      </div>

      <!-- Formulario de Empresa -->
      <div class="card mb-4" *ngIf="mostrarForm">
        <div class="card-body">
          <h5 class="card-title">{{ empresaForm.get('nit')?.value ? 'Editar' : 'Nueva' }} Empresa</h5>
          <form [formGroup]="empresaForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="nit" class="form-label">NIT</label>
                <input
                  type="text"
                  class="form-control"
                  id="nit"
                  formControlName="nit"
                >
                <div class="invalid-feedback" *ngIf="empresaForm.get('nit')?.errors?.['required'] && empresaForm.get('nit')?.touched">
                  El NIT es requerido
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
                <div class="invalid-feedback" *ngIf="empresaForm.get('nombre')?.errors?.['required'] && empresaForm.get('nombre')?.touched">
                  El nombre es requerido
                </div>
              </div>

              <div class="col-md-6">
                <label for="direccion" class="form-label">Dirección</label>
                <input
                  type="text"
                  class="form-control"
                  id="direccion"
                  formControlName="direccion"
                >
                <div class="invalid-feedback" *ngIf="empresaForm.get('direccion')?.errors?.['required'] && empresaForm.get('direccion')?.touched">
                  La dirección es requerida
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
                <div class="invalid-feedback" *ngIf="empresaForm.get('telefono')?.errors?.['required'] && empresaForm.get('telefono')?.touched">
                  El teléfono es requerido
                </div>
              </div>

              <div class="col-md-6">
                <label for="contacto" class="form-label">Contacto</label>
                <input
                  type="text"
                  class="form-control"
                  id="contacto"
                  formControlName="contacto"
                >
                <div class="invalid-feedback" *ngIf="empresaForm.get('contacto')?.errors?.['required'] && empresaForm.get('contacto')?.touched">
                  El contacto es requerido
                </div>
              </div>

              <div class="col-12">
                <button type="button" class="btn btn-primary" (click)="onSubmit()">
                   {{ empresaForm.get('nit')?.value ? 'Actualizar' : 'Crear' }}
                </button>
                <button type="button" class="btn btn-secondary ms-2" (click)="cancelar()">
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Tabla de Empresas -->
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>NIT</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let empresa of empresas">
              <td>{{ empresa.nit }}</td>
              <td>{{ empresa.nombre }}</td>
              <td>{{ empresa.direccion }}</td>
              <td>{{ empresa.telefono }}</td>
              <td>{{ empresa.contacto }}</td>
              <td>
                <button class="btn btn-sm btn-primary me-2" (click)="editarEmpresa(empresa)">
                  Editar
                </button>
                <button class="btn btn-sm btn-danger" (click)="eliminarEmpresa(empresa.nit)">
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
export class EmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  empresaForm: FormGroup;
  mostrarForm = false;

  constructor(
    private empresaService: EmpresaService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.empresaForm = this.fb.group({
      nit: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      contacto: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.getAll().subscribe({
      next: (empresas) => {
        this.empresas = empresas as Empresa[];
      },
      error: (error) => {
        this.notificationService.showError('Error al cargar las empresas');
        console.error('Error al cargar empresas:', error);
      }
    });
  }

  mostrarFormulario(): void {
    this.empresaForm.reset();
    this.mostrarForm = true;
  }

  editarEmpresa(empresa: Empresa): void {
    this.empresaForm.patchValue(empresa);
    this.mostrarForm = true;
  }

  onSubmit(): void {
    if (this.empresaForm.invalid) {
      return;
    }

    const empresa: Empresa = this.empresaForm.value;
    const nit = empresa.nit;

    if (this.empresas.some(e => e.nit === nit)) {
      // Actualizar empresa existente
      this.empresaService.update(nit, empresa).subscribe({
        next: () => {
          this.notificationService.showSuccess('Empresa actualizada exitosamente');
          this.cargarEmpresas();
          this.cancelar();
        },
        error: (error) => {
          this.notificationService.showError('Error al actualizar la empresa');
          console.error('Error al actualizar empresa:', error);
        }
      });
    } else {
      // Crear nueva empresa
      this.empresaService.create(empresa).subscribe({
        next: (resp) => {
          this.notificationService.showSuccess('Empresa creada exitosamente');
          this.cargarEmpresas();
          this.cancelar();
        },
        error: (error) => {
          let mensaje = 'Error al crear la empresa';
          if (error instanceof SyntaxError || (error.error && typeof error.error === 'string' && error.error.startsWith('<!DOCTYPE'))) {
            mensaje += ': El backend no está devolviendo un JSON válido. Por favor, revisa la respuesta del servidor.';
          }
          this.notificationService.showError(mensaje);
          console.error('Error al crear empresa:', error);
        }
      });
    }
  }

  eliminarEmpresa(nit: string): void {
    if (confirm('¿Está seguro de eliminar esta empresa?')) {
      this.empresaService.delete(nit).subscribe({
        next: () => {
          this.notificationService.showSuccess('Empresa eliminada exitosamente');
          this.cargarEmpresas();
        },
        error: (error) => {
          this.notificationService.showError('Error al eliminar la empresa');
          console.error('Error al eliminar empresa:', error);
        }
      });
    }
  }

  cancelar(): void {
    this.empresaForm.reset();
    this.mostrarForm = false;
  }
} 