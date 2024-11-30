import { Component, OnInit } from '@angular/core';
import { ConsumoService } from './consumo.service';
import { PlatoService } from '../plato/plato.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../empleado/empleado.service';


@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ConsumoComponent implements OnInit {
  consumos: any[] = [];
  consumo: any = { cedulaEmpleado: '', fecha: '', platosConsumidos: [] };
  platos: any[] = [];
  platoSeleccionado: string = '';
  cantidad: number = 1;
  editando: boolean = false;

  // Propiedades para la validación del empleado
  cedulaEmpleado: string = '';
  empleadoNombre: string = ''; // Para almacenar el nombre del empleado validado
  empleadoImagen: string = ''; // Para almacenar la URL de la imagen del empleado
  empleadoValidado: boolean = false;
  constructor(
    private consumoService: ConsumoService,
    private platoService: PlatoService,
    private empleadoService: EmpleadoService // Servicio de empleado
  ) {}

  ngOnInit(): void {
    this.obtenerConsumos();
    this.obtenerPlatos();
  }

  obtenerConsumos(): void {
    this.consumoService.obtenerConsumos().subscribe((data) => {
      this.consumos = data;
    });
  }

  obtenerPlatos(): void {
    this.platoService.obtenerPlatos().subscribe((data) => {
      this.platos = data;
    });
  }

  validarEmpleado(): void {
    this.empleadoService.obtenerEmpleadoPorCedula(this.cedulaEmpleado).subscribe(
      (data) => {
        this.empleadoValidado = true;
        this.empleadoNombre = data.nombre; // Asigna el nombre del empleado
        this.empleadoImagen = `http://localhost:8080/empleados/${this.cedulaEmpleado}/imagen`; // URL de la imagen
        this.consumo.cedulaEmpleado = this.cedulaEmpleado;
      },
      (error) => {
        console.error('Error al validar el empleado:', error);
        alert('No se encontró un empleado con la cédula proporcionada.');
      }
    );
  }
  
  

  agregarPlato(): void {
    if (this.platoSeleccionado && this.cantidad > 0) {
      const plato = {
        nombrePlato: this.platoSeleccionado,
        cantidad: this.cantidad,
      };
      this.consumo.platosConsumidos.push(plato);

      this.platoSeleccionado = '';
      this.cantidad = 1;
    }
  }

  guardarConsumo(): void {
    if (!this.consumo.cedulaEmpleado || !this.consumo.fecha || this.consumo.platosConsumidos.length === 0) {
      alert('Por favor, completa todos los campos antes de guardar el consumo.');
      return;
    }
  
    if (this.editando) {
      // Si se está editando un consumo existente
      this.consumoService.actualizarConsumo(this.consumo.id, this.consumo).subscribe(
        () => {
          alert('Consumo actualizado correctamente.');
          this.obtenerConsumos(); // Recargar la lista de consumos
          this.resetearFormulario(); // Reinicia el formulario
        },
        (error) => {
          console.error('Error al actualizar el consumo:', error);
          alert('Hubo un error al actualizar el consumo.');
        }
      );
    } else {
      // Si es un consumo nuevo
      this.consumoService.anadirConsumo(this.consumo).subscribe(
        () => {
          alert('Consumo guardado correctamente.');
          this.obtenerConsumos(); // Recargar la lista de consumos
          this.resetearFormulario(); // Reinicia el formulario
        },
        (error) => {
          console.error('Error al guardar el consumo:', error);
          alert('Hubo un error al guardar el consumo.');
        }
      );
    }
  }
  

    
  editarConsumo(consumo: any): void {
    this.consumo = {
      id: consumo.id,
      cedulaEmpleado: consumo.cedulaEmpleado,
      fecha: consumo.fecha,
      platosConsumidos: [...consumo.platosConsumidos], // Clonar la lista de platos
    };
    this.editando = true; // Cambiar el estado a edición
  }
  
  

  eliminarConsumo(id: number): void {
    this.consumoService.eliminarConsumo(id).subscribe(() => {
      this.obtenerConsumos();
    });
  }

  resetearFormulario(): void {
    this.consumo = { cedulaEmpleado: '', fecha: '', platosConsumidos: [] };
    this.editando = false;
  }
}
