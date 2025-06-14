import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h1 class="display-4">Panel de Administración</h1>
          <p class="lead" *ngIf="currentUser">
            Bienvenido, {{ currentUser.nombre }} {{ getRoleName() }}
          </p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Gestión de Empresas -->
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Gestión de Empresas</h5>
              <p class="card-text">
                Administre las empresas registradas en el sistema, incluyendo su información
                y configuración.
              </p>
              <a [routerLink]="['/admin/empresas']" class="btn btn-primary">
                Gestionar Empresas
              </a>
            </div>
          </div>
        </div>

        <!-- Gestión de Platos -->
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Gestión de Platos</h5>
              <p class="card-text">
                Administre el menú de platos disponibles, incluyendo precios, categorías
                y disponibilidad.
              </p>
              <a [routerLink]="['/admin/platos']" class="btn btn-primary">
                Gestionar Platos
              </a>
            </div>
          </div>
        </div>

        <!-- Gestión de Usuarios -->
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Gestión de Usuarios</h5>
              <p class="card-text">
                Administre los usuarios del sistema, cree, edite, elimine y cambie contraseñas de administradores, cajeros y contadores.
              </p>
              <a [routerLink]="['/admin/usuarios']" class="btn btn-primary">
                Gestionar Usuarios
              </a>
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
export class AdminDashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    // Cleanup code if needed
  }

  getRoleName(): string {
    if (!this.currentUser) return '';

    switch (this.currentUser.rol) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.CAJERO:
        return 'Cajero';
      case UserRole.CONTADOR:
        return 'Contador';
      case UserRole.CONSUMIDOR:
        return 'Consumidor';
      default:
        return '';
    }
  }
} 