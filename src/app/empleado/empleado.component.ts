import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from './empleado.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa los módulos necesarios
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
  editando: boolean = false; // Indica si estamos editando un empleado

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

  registrarEmpleado(): void {
    this.empleadoService.anadirEmpleado(this.nuevoEmpleado).subscribe(
      (data) => {
        this.empleados.push(data);
        alert('Empleado registrado exitosamente.');
        this.resetFormulario();
      },
      (error) => {
        console.error('Error al registrar el empleado:', error);
      }
    );
  }

  cargarEmpleado(empleado: any): void {
    // Cargar los datos del empleado seleccionado al formulario
    this.nuevoEmpleado = { ...empleado };
    this.editando = true;
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
          this.cancelarEdicion(); // Salir del modo edición
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
  }
}
