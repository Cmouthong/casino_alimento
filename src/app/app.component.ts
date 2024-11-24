import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router: Router){}
  title = 'casino-alimento';
  inicio(){
    this.router.navigate(['/home'])
  }
  registroEmpresa(){
    this.router.navigate(['/empresa'])
  }
  registroEmpleado(){
    this.router.navigate(['/empleado'])
  }
  consumo(){
    this.router.navigate(['/consumo'])
  }
  reporte(){
    this.router.navigate(['/reporte'])
  }
  plato(){
    this.router.navigate(['/plato'])
  }
}