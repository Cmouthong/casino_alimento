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
                    <a class="nav-link" href="#" (click)="registroEmpresa(); $event.preventDefault()">
                      Empresas
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="plato(); $event.preventDefault()">
                      Platos
                    </a>
                  </li>
                </ng-container>

                <!-- Cajero Menu -->
                <ng-container *ngIf="currentUser.rol === UserRole.CAJERO">
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="registrarConsumidor(); $event.preventDefault()">
                      Consumidores
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="consumo(); $event.preventDefault()">
                      Consumos
                    </a>
                  </li>
                </ng-container>

                <!-- Contador Menu -->
                <ng-container *ngIf="currentUser.rol === UserRole.CONTADOR">
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="reporte(); $event.preventDefault()">
                      Reportes
                    </a>
                  </li>
                </ng-container>

                <!-- Consumidor Menu -->
                <ng-container *ngIf="currentUser.rol === UserRole.CONSUMIDOR">
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="consumo(); $event.preventDefault()">
                      Mis Consumos
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#" (click)="consumo(); $event.preventDefault()">
                      Mi Perfil
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
          <span class="text-muted">© 2024 Casino Alimento. Todos los derechos reservados.</span>
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
  showAdminMenu = false;
  showCajeroMenu = false;
  showContadorMenu = false;
  showConsumidorMenu = false;
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
      this.checkUserRole();
      this.checkRouteAccess();
    });

    // Suscribirse a los cambios de ruta
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
        case 'ADMIN':
          this.router.navigate(['/admin/dashboard']);
          break;
        case 'CAJERO':
          this.router.navigate(['/cajero/dashboard']);
          break;
        case 'CONTADOR':
          this.router.navigate(['/contador/dashboard']);
          break;
        case 'CONSUMIDOR':
          this.router.navigate(['/consumidor/dashboard']);
          break;
        default:
          this.router.navigate(['/auth/login']);
      }
    }
  }

  registroEmpresa(): void {
    if (this.currentUser?.rol === 'ADMIN') {
      this.router.navigate(['/admin/empresas']);
    }
  }

  registrarConsumidor(): void {
    if (this.currentUser?.rol === 'CAJERO') {
      this.router.navigate(['/cajero/consumidores']);
    }
  }

  consumo(): void {
    if (this.currentUser?.rol === 'CAJERO') {
      this.router.navigate(['/cajero/consumos']);
    } else if (this.currentUser?.rol === 'CONSUMIDOR') {
      this.router.navigate(['/consumidor/consumos']);
    }
  }

  reporte(): void {
    if (this.currentUser?.rol === 'CONTADOR') {
      this.router.navigate(['/contador/reportes']);
    }
  }

  plato(): void {
    if (this.currentUser?.rol === 'ADMIN') {
      this.router.navigate(['/admin/platos']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRoleName(): string {
    if (!this.currentUser) return '';

    switch (this.currentUser.rol) {
      case 'ADMIN':
        return 'Administrador';
      case 'CAJERO':
        return 'Cajero';
      case 'CONTADOR':
        return 'Contador';
      case 'CONSUMIDOR':
        return 'Consumidor';
      default:
        return '';
    }
  }

  private checkUserRole(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      switch (user.rol) {
        case 'ADMIN':
          this.showAdminMenu = true;
          this.showCajeroMenu = false;
          this.showContadorMenu = false;
          this.showConsumidorMenu = false;
          break;
        case 'CAJERO':
          this.showAdminMenu = false;
          this.showCajeroMenu = true;
          this.showContadorMenu = false;
          this.showConsumidorMenu = false;
          break;
        case 'CONTADOR':
          this.showAdminMenu = false;
          this.showCajeroMenu = false;
          this.showContadorMenu = true;
          this.showConsumidorMenu = false;
          break;
        case 'CONSUMIDOR':
          this.showAdminMenu = false;
          this.showCajeroMenu = false;
          this.showContadorMenu = false;
          this.showConsumidorMenu = true;
          break;
      }
    }
  }

  private checkRouteAccess(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const currentRoute = this.router.url;
    if (currentRoute.startsWith('/admin') && user.rol !== 'ADMIN') {
      this.router.navigate(['/auth/login']);
    } else if (currentRoute.startsWith('/cajero') && user.rol !== 'CAJERO') {
      this.router.navigate(['/auth/login']);
    } else if (currentRoute.startsWith('/contador') && user.rol !== 'CONTADOR') {
      this.router.navigate(['/auth/login']);
    } else if (currentRoute.startsWith('/consumidor') && user.rol !== 'CONSUMIDOR') {
      this.router.navigate(['/auth/login']);
    }
  }
} 