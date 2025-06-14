import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../core/services/usuario.service';
import { FormsModule } from '@angular/forms';

interface UsuarioTabla {
  cedula: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  activo: boolean;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Gestión de Usuarios</h2>
      <!-- Modal de edición -->
      <div class="modal fade" tabindex="-1" [ngClass]="{show: showEditModal}" [ngStyle]="{display: showEditModal ? 'block' : 'none'}">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Editar Usuario</h5>
              <button type="button" class="btn-close" (click)="closeEditModal()"></button>
            </div>
            <div class="modal-body">
              <form #editForm="ngForm" (ngSubmit)="guardarEdicion()">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input class="form-control" [(ngModel)]="editUsuario.nombre" name="nombre" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Correo</label>
                  <input class="form-control" [(ngModel)]="editUsuario.email" name="email" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Teléfono</label>
                  <input class="form-control" [(ngModel)]="editUsuario.telefono" name="telefono" required />
                </div>
                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" id="cambiarPasswordCheck" [(ngModel)]="cambiarPassword" name="cambiarPassword">
                  <label class="form-check-label" for="cambiarPasswordCheck">¿Desea cambiar la contraseña?</label>
                </div>
                <div class="mb-3">
                  <label class="form-label">{{ cambiarPassword ? 'Nueva contraseña' : 'Contraseña actual (requerida para editar)' }}</label>
                  <div class="input-group">
                    <input class="form-control"
                           [ngModel]="cambiarPassword ? editUsuario.password : passwordActual"
                           (ngModelChange)="cambiarPassword ? editUsuario.password = $event : passwordActual = $event"
                           name="passwordField"
                           [type]="mostrarPassword ? 'text' : 'password'"
                           required
                           [autocomplete]="cambiarPassword ? 'new-password' : 'current-password'" />
                    <button type="button"
                            class="btn btn-outline-secondary"
                            (click)="mostrarPassword = !mostrarPassword"
                            tabindex="-1">
                      <span *ngIf="mostrarPassword">🙈</span>
                      <span *ngIf="!mostrarPassword">👁️</span>
                    </button>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="editForm.invalid">Guardar</button>
                <button type="button" class="btn btn-secondary ms-2" (click)="closeEditModal()">Cancelar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Fin modal -->
      <button class="btn btn-success mb-3" (click)="abrirCrear()">Crear Usuario</button>
      <!-- Modal de creación -->
      <div class="modal fade" tabindex="-1" [ngClass]="{show: showCreateModal}" [ngStyle]="{display: showCreateModal ? 'block' : 'none'}">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Crear Usuario</h5>
              <button type="button" class="btn-close" (click)="closeCreateModal()"></button>
            </div>
            <div class="modal-body">
              <form #createForm="ngForm" (ngSubmit)="crearUsuario()">
                <div class="mb-3">
                  <label class="form-label">Cédula</label>
                  <input class="form-control" [(ngModel)]="nuevoUsuario.cedula" name="cedula" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input class="form-control" [(ngModel)]="nuevoUsuario.nombre" name="nombre" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Correo</label>
                  <input class="form-control" [(ngModel)]="nuevoUsuario.email" name="email" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Teléfono</label>
                  <input class="form-control" [(ngModel)]="nuevoUsuario.telefono" name="telefono" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Contraseña</label>
                  <input class="form-control" [(ngModel)]="nuevoUsuario.password" name="password" type="password" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Rol</label>
                  <select class="form-select" [(ngModel)]="nuevoUsuario.rol" name="rol" required>
                    <option value="ADMIN">Administrador</option>
                    <option value="CAJERO">Cajero</option>
                    <option value="CONTADOR">Contador</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="createForm.invalid">Crear</button>
                <button type="button" class="btn btn-secondary ms-2" (click)="closeCreateModal()">Cancelar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h4>Usuarios Activos</h4>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let usuario of usuariosActivos">
                <td>{{ usuario.nombre }}</td>
                <td>{{ usuario.cedula }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ usuario.rol }}</td>
                <td>
                  <button class="btn btn-sm btn-primary me-2" (click)="abrirEditar(usuario)">Editar</button>
                  <button class="btn btn-sm btn-danger" (click)="desactivarUsuario(usuario)">Desactivar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-12">
          <h4>Usuarios Desactivados</h4>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let usuario of usuariosDesactivados">
                <td>{{ usuario.nombre }}</td>
                <td>{{ usuario.cedula }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ usuario.rol }}</td>
                <td>
                  <button class="btn btn-sm btn-success" (click)="reactivarUsuario(usuario)">Reactivar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class UsuariosComponent implements OnInit {
  usuarios: UsuarioTabla[] = [];
  showEditModal = false;
  editUsuario: any = {};
  showCreateModal = false;
  nuevoUsuario: any = {};
  usuariosEliminados: UsuarioTabla[] = [];
  cambiarPassword = false;
  passwordActual: string = '';
  mostrarPassword = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarUsuariosEliminados();
  }

  get usuariosActivos() {
    return this.usuarios.filter(u => u.activo);
  }
  get usuariosDesactivados() {
    return this.usuariosEliminados;
  }

  desactivarUsuario(usuario: UsuarioTabla) {
    if (confirm(`¿Seguro que deseas desactivar al usuario ${usuario.nombre} (${usuario.cedula})?`)) {
      this.usuarioService.delete(usuario.cedula).subscribe({
        next: (resp) => {
          usuario.activo = false;
          this.cargarUsuarios();
          this.cargarUsuariosEliminados();
          alert(resp || 'Usuario desactivado exitosamente');
        },
        error: (err) => {
          alert('Error al desactivar usuario');
          console.error(err);
        }
      });
    }
  }

  abrirEditar(usuario: UsuarioTabla) {
    this.editUsuario = { ...usuario };
    this.cambiarPassword = false;
    this.passwordActual = '';
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editUsuario = {};
  }

  guardarEdicion() {
    const { cedula, nombre, email, telefono, password } = this.editUsuario;
    const data: any = { nombre, email, telefono };
    if (this.cambiarPassword && password && password.trim() !== '') {
      data.password = password;
    } else {
      data.password = this.passwordActual;
    }
    this.usuarioService.update(cedula, data).subscribe({
      next: (resp) => {
        this.cargarUsuarios();
        this.closeEditModal();
        alert(resp || 'Usuario editado exitosamente');
      },
      error: (err) => {
        alert('Error al editar usuario');
        console.error(err);
      }
    });
  }

  reactivarUsuario(usuario: UsuarioTabla) {
    if (confirm(`¿Seguro que deseas reactivar al usuario ${usuario.nombre} (${usuario.cedula})?`)) {
      this.usuarioService.reactivar(usuario.cedula).subscribe({
        next: (resp) => {
          usuario.activo = true;
          this.cargarUsuarios();
          this.cargarUsuariosEliminados();
          alert(resp || 'Usuario reactivado exitosamente');
        },
        error: (err) => {
          alert('Error al reactivar usuario');
          console.error(err);
        }
      });
    }
  }

  abrirCrear() {
    this.nuevoUsuario = {};
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.nuevoUsuario = {};
  }

  crearUsuario() {
    console.log('Enviando usuario:', this.nuevoUsuario);
    this.usuarioService.create(this.nuevoUsuario).subscribe({
      next: () => {
        // Recargar usuarios desde el backend para reflejar el nuevo usuario
        this.ngOnInit();
        this.closeCreateModal();
      },
      error: (err) => {
        alert('Error al crear usuario');
        console.error(err);
      }
    });
  }

  private cargarUsuariosEliminados() {
    this.usuarioService.getEliminados().subscribe({
      next: (data) => {
        this.usuariosEliminados = data.map(u => ({
          cedula: u.cedula,
          nombre: u.nombre,
          email: u.email,
          telefono: u.telefono,
          rol: u.rol,
          activo: false
        }));
      },
      error: (err) => {
        console.error('Error al cargar usuarios eliminados:', err);
      }
    });
  }

  private cargarUsuarios() {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data.map(u => ({
          cedula: u.cedula,
          nombre: u.nombre,
          email: u.email,
          telefono: u.telefono,
          rol: u.rol,
          activo: (u as any).activo !== undefined ? (u as any).activo : true
        }));
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }
} 