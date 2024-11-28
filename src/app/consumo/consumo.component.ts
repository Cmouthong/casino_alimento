import { Component, OnInit } from '@angular/core';
import { ConsumoService } from './consumo.service';
import { PlatoService } from '../plato/plato.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ConsumoComponent implements OnInit {
  consumos: any[] = []; // Lista de consumos registrados
  consumo: any = { cedulaEmpleado: '', fecha: '', platosConsumidos: [] }; // Objeto de consumo actual
  platos: any[] = []; // Lista de platos disponibles
  platoSeleccionado: string = ''; // Plato seleccionado para añadir
  cantidad: number = 1; // Cantidad seleccionada
  editando: boolean = false; // Estado de edición

  constructor(
    private consumoService: ConsumoService,
    private platoService: PlatoService
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

  agregarPlato(): void {
    if (this.platoSeleccionado && this.cantidad > 0) {
      const plato = {
        nombrePlato: this.platoSeleccionado,
        cantidad: this.cantidad,
      };
      this.consumo.platosConsumidos.push(plato);

      // Reinicia los campos de selección
      this.platoSeleccionado = '';
      this.cantidad = 1;
    }
  }

  guardarConsumo(): void {
    // Validación de datos básicos
    if (!this.consumo.cedulaEmpleado || !this.consumo.fecha) {
      alert('Por favor, completa los datos del consumo.');
      return;
    }
  
    if (this.consumo.platosConsumidos.length === 0) {
      alert('Debes añadir al menos un plato al consumo.');
      return;
    }
  
    // Actualización de un consumo existente
    if (this.editando) {
      this.consumoService
        .actualizarConsumo(this.consumo.id, this.consumo)
        .subscribe(
          () => {
            alert('Consumo actualizado correctamente.');
            this.obtenerConsumos(); // Actualizar la lista de consumos
            this.resetearFormulario(); // Resetear el formulario
          },
          (error) => {
            console.error('Error al actualizar el consumo:', error);
            alert('Hubo un error al actualizar el consumo.');
          }
        );
    } else {
      // Lógica para añadir un nuevo consumo
      this.consumoService.anadirConsumo(this.consumo).subscribe(
        () => {
          alert('Consumo añadido correctamente.');
          this.obtenerConsumos();
          this.resetearFormulario();
        },
        (error) => {
          console.error('Error al añadir el consumo:', error);
          alert('Hubo un error al añadir el consumo.');
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
    this.editando = true;
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
