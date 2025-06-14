import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserRole } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">Manaos Connect</h2>
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="cedula" class="form-label">Cédula</label>
                  <input type="text" 
                         class="form-control" 
                         id="cedula" 
                         formControlName="cedula"
                         placeholder="Ingrese su cédula">
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input type="password" 
                         class="form-control" 
                         id="password" 
                         formControlName="password"
                         placeholder="Ingrese su contraseña">
                </div>
                
                <button type="submit" 
                        class="btn btn-primary w-100" 
                        [disabled]="loginForm.invalid">
                  Iniciar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.formBuilder.group({
      cedula: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Obtener la URL de retorno de los query params o usar la ruta por defecto
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Si ya está autenticado, redirigir al dashboard correspondiente
    const user = this.authService.getCurrentUser();
    if (user) {
      this.redirectBasedOnRole(user);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { cedula, password } = this.loginForm.value;

    this.authService.login(cedula, password).subscribe({
      next: (user) => {
        this.notificationService.showSuccess('Inicio de sesión exitoso');
        // Redirigir según el rol del usuario recibido
        this.redirectBasedOnRole(user);
      },
      error: (error) => {
        this.notificationService.showError('Error al iniciar sesión');
        console.error('Error de login:', error);
      }
    });
  }

  private redirectBasedOnRole(user: any): void {
    console.log('Usuario recibido para redirección:', user);
    if (!user) return;
    switch (user.rol) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'CAJERO':
        this.router.navigate(['/cajero/dashboard']);
        break;
      case 'CONTADOR':
        this.router.navigate(['/contador/reportes']);
        break;
      case 'CONSUMIDOR':
        this.router.navigate(['/consumidor/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
} 