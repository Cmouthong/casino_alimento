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
    if (!this.consumo.cedulaEmpleado || !this.consumo.fecha) {
      alert('Por favor, completa los datos del consumo.');
      return;
    }

    if (this.consumo.platosConsumidos.length === 0) {
      alert('Debes añadir al menos un plato al consumo.');
      return;
    }

    if (this.editando) {
      this.consumoService
        .actualizarConsumo(this.consumo.id, this.consumo)
        .subscribe(() => {
          this.obtenerConsumos();
          this.resetearFormulario();
        });
    } else {
      this.consumoService.anadirConsumo(this.consumo).subscribe(() => {
        this.obtenerConsumos();
        this.resetearFormulario();
      });
    }
  }

  editarConsumo(consumo: any): void {
    this.consumo = { ...consumo }; // Copia del consumo seleccionado
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
