import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-consumidor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h2>Bienvenido, {{ currentUser?.nombre }}</h2>
          <p class="lead">Panel de Control del Consumidor</p>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Mis Consumos</h5>
              <p class="card-text">Ver el historial de tus consumos y realizar nuevos pedidos.</p>
              <a routerLink="consumos" class="btn btn-primary">Gestionar Consumos</a>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Mi Perfil</h5>
              <p class="card-text">Actualizar tu información personal y preferencias.</p>
              <a routerLink="perfil" class="btn btn-primary">Editar Perfil</a>
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
export class ConsumidorDashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
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