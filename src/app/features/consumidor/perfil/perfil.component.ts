import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Consumidor } from '../../../core/models/consumidor.model';
import { User } from '../../../core/interfaces/user.interface';
import { ConsumidorService } from '../../../core/services/consumidor.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body text-center">
              <img [src]="imagenUrl || 'assets/default-avatar.png'" 
                   class="rounded-circle mb-3" 
                   style="width: 150px; height: 150px; object-fit: cover;">
              <h5 class="card-title">{{currentUser?.nombre}}</h5>
              <p class="card-text">{{currentUser?.email}}</p>
              
              <div class="mt-3">
                <input type="file" 
                       class="form-control" 
                       accept="image/*" 
                       (change)="onImagenChange($event)">
                <button class="btn btn-primary mt-2" 
                        (click)="onImagenSubmit()" 
                        [disabled]="!imagenSeleccionada">
                  Actualizar Imagen
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Información Personal</h4>
              <form [formGroup]="perfilForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="cedula" class="form-label">Cédula</label>
                  <input type="text" 
                         class="form-control" 
                         id="cedula" 
                         formControlName="cedula" 
                         readonly>
                </div>
                
                <div class="mb-3">
                  <label for="nombre" class="form-label">Nombre</label>
                  <input type="text" 
                         class="form-control" 
                         id="nombre" 
                         formControlName="nombre">
                </div>
                
                <div class="mb-3">
                  <label for="telefono" class="form-label">Teléfono</label>
                  <input type="text" 
                         class="form-control" 
                         id="telefono" 
                         formControlName="telefono">
                </div>
                
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" 
                         class="form-control" 
                         id="email" 
                         formControlName="email">
                </div>
                
                <button type="submit" 
                        class="btn btn-primary" 
                        [disabled]="perfilForm.invalid">
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PerfilComponent implements OnInit, OnDestroy {
  perfilForm: FormGroup;
  imagenSeleccionada: File | null = null;
  imagenUrl: string | null = null;
  currentUser: User | null = null;

  constructor(
    private consumidorService: ConsumidorService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.perfilForm = this.formBuilder.group({
      cedula: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.cargarPerfil();
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup code if needed
  }

  cargarPerfil(): void {
    if (!this.currentUser) return;

    this.consumidorService.getByCedula(this.currentUser.cedula).subscribe({
      next: (consumidor) => {
        this.perfilForm.patchValue(consumidor);
        this.cargarImagen();
      },
      error: (error) => {
        this.notificationService.showError('Error al cargar el perfil');
        console.error('Error al cargar perfil:', error);
      }
    });
  }

  cargarImagen(): void {
    if (!this.currentUser) return;

    this.consumidorService.getImagen(this.currentUser.cedula).subscribe({
      next: (blob) => {
        this.imagenUrl = URL.createObjectURL(blob);
      },
      error: (error) => {
        console.error('Error al cargar imagen:', error);
      }
    });
  }

  onImagenChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenSeleccionada = input.files[0];
    }
  }

  onImagenSubmit(): void {
    if (!this.imagenSeleccionada || !this.currentUser) return;

    this.consumidorService.subirImagen(this.currentUser.cedula, this.imagenSeleccionada).subscribe({
      next: () => {
        this.notificationService.showSuccess('Imagen actualizada exitosamente');
        this.imagenSeleccionada = null;
        this.cargarImagen();
      },
      error: (error) => {
        this.notificationService.showError('Error al actualizar la imagen');
        console.error('Error al actualizar imagen:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.perfilForm.invalid || !this.currentUser) {
      return;
    }

    const consumidor: Consumidor = this.perfilForm.value;

    this.consumidorService.update(this.currentUser.cedula, consumidor).subscribe({
      next: () => {
        this.notificationService.showSuccess('Perfil actualizado exitosamente');
      },
      error: (error) => {
        this.notificationService.showError('Error al actualizar el perfil');
        console.error('Error al actualizar perfil:', error);
      }
    });
  }
}