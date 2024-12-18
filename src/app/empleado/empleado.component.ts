import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from './empleado.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss'],
})
export class EmpleadoComponent implements OnInit {
  empleados: any[] = [];
  nuevoEmpleado: any = {
    cedula: '',
    nombre: '',
    empresaNIT: '',
    telefono: '',
  };
  archivoImagen: File | null = null; // Archivo de la imagen seleccionada
  editando: boolean = false;

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.empleadoService.obtenerTodosLosEmpleados().subscribe(
      (data) => {
        this.empleados = data;
      },
      (error) => {
        console.error('Error al cargar los empleados:', error);
      }
    );
  }

  seleccionarImagen(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoImagen = file;
    }
  }

  registrarEmpleado(): void {
    if (this.archivoImagen) {
      const formData = new FormData();
      formData.append('imagen', this.archivoImagen); // Adjuntar la imagen
      formData.append('empleado', new Blob([JSON.stringify(this.nuevoEmpleado)], { type: 'application/json' }));
  
      this.empleadoService.anadirEmpleadoConImagen(formData).subscribe(
        (data) => {
          this.empleados.push(data);
          alert('Empleado registrado exitosamente.');
          this.resetFormulario();
        },
        (error) => {
          console.error('Error al registrar el empleado:', error);
          alert('Error al registrar Empleado'); // Mensaje de alerta en caso de error
        }
      );
    } else {
      alert('Por favor selecciona una imagen antes de registrar el empleado.');
    }
  }
  

  actualizarEmpleado(): void {
    this.empleadoService
      .actualizarEmpleado(this.nuevoEmpleado.cedula, this.nuevoEmpleado)
      .subscribe(
        (data) => {
          const index = this.empleados.findIndex(
            (emp) => emp.cedula === this.nuevoEmpleado.cedula
          );
          if (index !== -1) {
            this.empleados[index] = data; // Actualizar la lista local
          }
          alert('Empleado actualizado exitosamente.');
          this.cancelarEdicion();
        },
        (error) => {
          console.error('Error al actualizar el empleado:', error);
        }
      );
  }

  eliminarEmpleado(cedula: string): void {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(cedula).subscribe(
        () => {
          this.empleados = this.empleados.filter(
            (empleado) => empleado.cedula !== cedula
          );
          alert('Empleado eliminado exitosamente.');
        },
        (error) => {
          console.error('Error al eliminar el empleado:', error);
        }
      );
    }
  }

  cargarEmpleado(empleado: any): void {
    this.nuevoEmpleado = { ...empleado };
    this.editando = true;
  }

  cancelarEdicion(): void {
    this.resetFormulario();
    this.editando = false;
  }

  private resetFormulario(): void {
    this.nuevoEmpleado = {
      cedula: '',
      nombre: '',
      empresaNIT: '',
      telefono: '',
    };
    this.archivoImagen = null;
  }
}
