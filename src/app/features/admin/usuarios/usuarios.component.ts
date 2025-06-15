import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../core/services/usuario.service';
import { FormsModule } from '@angular/forms';
import { RegistroUsuarioRequest } from '../../../core/interfaces/registro-usuario-request';
import { UserRole } from '../../../core/interfaces/user.interface';
import { NotificationService } from '../../../shared/services/notification.service';

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
  templateUrl: './usuarios.component.html',
  styles: [``]
})
export class UsuariosComponent implements OnInit {
  usuarios: UsuarioTabla[] = [];
  showEditModal = false;
  editUsuario: Partial<RegistroUsuarioRequest> = {
    password: '',
    email: '',
    nombre: '',
    telefono: ''
  };
  showCreateModal = false;
  nuevoUsuario: RegistroUsuarioRequest = {
    cedula: '',
    password: '',
    rol: UserRole.ADMIN,
    email: '',
    nombre: '',
    telefono: ''
  };
  usuariosEliminados: UsuarioTabla[] = [];
  cambiarPassword = false;
  cedulaEditando: string = '';
  mostrarPassword = false;

  constructor(private usuarioService: UsuarioService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarUsuariosEliminados();
  }

  get usuariosActivos() {
    if (this.usuarios.length > 0 && this.usuarios[0].activo === undefined) {
      return this.usuarios;
    }
    return this.usuarios.filter(u => u.activo);
  }

  get usuariosDesactivados() {
    return this.usuariosEliminados;
  }

  desactivarUsuario(usuario: UsuarioTabla) {
    if (confirm(`¿Seguro que deseas desactivar al usuario ${usuario.nombre} (${usuario.cedula})?`)) {
      this.usuarioService.delete(usuario.cedula).subscribe({
        next: () => {
          window.location.reload();
        },
        error: () => {
          window.location.reload();
        }
      });
    }
  }

  abrirEditar(usuario: UsuarioTabla) {
    this.editUsuario = {
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      password: ''
    };
    this.cambiarPassword = false;
    this.cedulaEditando = usuario.cedula;
    this.mostrarPassword = false;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editUsuario = {
      password: '',
      email: '',
      nombre: '',
      telefono: ''
    };
    this.cedulaEditando = '';
  }

  guardarEdicion() {
    const { nombre, email, telefono, password } = this.editUsuario;
    const usuarioOriginal = this.usuarios.find(u => u.cedula === this.cedulaEditando);
    if (!usuarioOriginal) return;
    const data: RegistroUsuarioRequest = {
      cedula: this.cedulaEditando,
      rol: usuarioOriginal.rol as UserRole,
      nombre: nombre!,
      email: email!,
      telefono: telefono!,
      password: this.cambiarPassword && password && password.trim() !== ''
        ? password
        : ''
    };
    this.usuarioService.update(this.cedulaEditando, data).subscribe({
      next: () => {
        window.location.reload();
      },
      error: () => {
        window.location.reload();
      }
    });
  }

  reactivarUsuario(usuario: UsuarioTabla) {
    if (confirm(`¿Seguro que deseas reactivar al usuario ${usuario.nombre} (${usuario.cedula})?`)) {
      this.usuarioService.reactivar(usuario.cedula).subscribe({
        next: () => {
          window.location.reload();
        },
        error: () => {
          window.location.reload();
        }
      });
    }
  }

  abrirCrear() {
    this.nuevoUsuario = {
      cedula: '',
      password: '',
      rol: UserRole.ADMIN,
      email: '',
      nombre: '',
      telefono: ''
    };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.nuevoUsuario = {
      cedula: '',
      password: '',
      rol: UserRole.ADMIN,
      email: '',
      nombre: '',
      telefono: ''
    };
  }

  crearUsuario() {
    if (this.usuarios.some(u => u.cedula === this.nuevoUsuario.cedula)) {
      this.notificationService.showError('Ya existe un usuario con esa cédula.');
      return;
    }
    this.usuarioService.create(this.nuevoUsuario).subscribe({
      next: () => {
        window.location.reload();
      },
      error: () => {
        window.location.reload();
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
          activo: u.activo ?? false
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
        console.log('Usuarios recibidos:', data);
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