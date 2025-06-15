import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/interfaces/user.interface';

@Injectable()
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#" (click)="inicio(); $event.preventDefault()">
            Casino Alimento
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <ng-container *ngIf="currentUser">
                <!-- Admin Menu -->
                <ng-container *ngIf="currentUser.rol === UserRole.ADMIN">
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="gestionEmpresas(); $event.preventDefault()">
                      Gestión de Empresas
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="gestionConsumidores(); $event.preventDefault()">
                      Gestión de Consumidores
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="gestionPlatos(); $event.preventDefault()">
                      Gestión de Platos
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="gestionUsuarios(); $event.preventDefault()">
                      Gestión de Usuarios
                    </a>
                  </li>
                </ng-container>

                <!-- Cajero Menu -->
                <ng-container *ngIf="currentUser.rol === UserRole.CAJERO">
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="gestionConsumos(); $event.preventDefault()">
                      Gestión de Consumos
                    </a>
                  </li>
                </ng-container>

                <!-- Contador Menu -->
                <ng-container *ngIf="currentUser.rol === UserRole.CONTADOR">
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="gestionReportes(); $event.preventDefault()">
                      Gestión de Reportes
                    </a>
                  </li>
                </ng-container>
              </ng-container>
            </ul>
            <div class="d-flex align-items-center">
              <span class="text-white me-3" *ngIf="currentUser">
                {{ getRoleName() }}: {{ currentUser.nombre }}
              </span>
              <button class="btn btn-outline-light" (click)="logout()">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-grow-1 p-3">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-light py-3 mt-auto">
        <div class="container text-center">
          <span class="text-muted">© 2025 Casino Alimento. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  UserRole = UserRole;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$),
      filter(user => !!user)
    ).subscribe(user => {
      this.currentUser = user;
      this.checkRouteAccess();
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.checkRouteAccess();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  inicio(): void {
    if (this.currentUser) {
      switch (this.currentUser.rol) {
        case UserRole.ADMIN:
          this.router.navigate(['/admin/dashboard']);
          break;
        case UserRole.CAJERO:
          this.router.navigate(['/cajero/dashboard']);
          break;
        case UserRole.CONTADOR:
          this.router.navigate(['/contador/dashboard']);
          break;
        default:
          this.router.navigate(['/login']);
      }
    }
  }

  gestionEmpresas(): void {
    if (this.currentUser?.rol === UserRole.ADMIN) {
      this.router.navigate(['/admin/empresas']);
    }
  }

  gestionConsumidores(): void {
    if (this.currentUser?.rol === UserRole.ADMIN) {
      this.router.navigate(['/admin/consumidores']);
    }
  }

  gestionPlatos(): void {
    if (this.currentUser?.rol === UserRole.ADMIN) {
      this.router.navigate(['/admin/platos']);
    }
  }

  gestionUsuarios(): void {
    if (this.currentUser?.rol === UserRole.ADMIN) {
      this.router.navigate(['/admin/usuarios']);
    }
  }

  gestionConsumos(): void {
    if (this.currentUser?.rol === UserRole.CAJERO) {
      this.router.navigate(['/cajero/consumos']);
    }
  }

  gestionReportes(): void {
    if (this.currentUser?.rol === UserRole.CONTADOR) {
      this.router.navigate(['/contador/reportes']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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

  private checkRouteAccess(): void {
    const currentRoute = this.router.url;
    if (!this.currentUser) {
      if (!currentRoute.includes('/login')) {
        this.router.navigate(['/login']);
      }
      return;
    }

    // Verificar acceso basado en roles
    if (currentRoute.includes('/admin') && this.currentUser.rol !== UserRole.ADMIN) {
      this.router.navigate(['/login']);
    } else if (currentRoute.includes('/cajero') && this.currentUser.rol !== UserRole.CAJERO) {
      this.router.navigate(['/login']);
    } else if (currentRoute.includes('/contador') && this.currentUser.rol !== UserRole.CONTADOR) {
      this.router.navigate(['/login']);
    }
  }
} 