import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-cajero-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h1 class="display-4">Panel de Cajero</h1>
          <p class="lead" *ngIf="currentUser">
            Bienvenido, {{ currentUser.nombre }} {{ getRoleName() }}
          </p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Gestión de Consumos -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Gestión de Consumos</h5>
              <p class="card-text">
                Registre y administre los consumos de los empleados, incluyendo la selección
                de platos y el cálculo de totales.
              </p>
              <a [routerLink]="['/cajero/consumos']" class="btn btn-primary">
                Gestionar Consumos
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
export class CajeroDashboardComponent implements OnInit, OnDestroy {
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
      default:
        return '';
    }
  }
} 