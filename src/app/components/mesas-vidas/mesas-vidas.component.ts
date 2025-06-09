import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mesas-vidas',
  standalone: true,
   imports: [CommonModule],
  templateUrl: './mesas-vidas.component.html',
  styleUrls: ['./mesas-vidas.component.css']
})
export class MesasVidasComponent implements OnInit {
  mesas: any[] = [];

  ngOnInit(): void {
  const guardado = localStorage.getItem('estadoMesas');
  if (guardado) {
    try {
      this.mesas = JSON.parse(guardado);
    } catch (e) {
      console.error('Error al leer localStorage, reiniciando...', e);
      this.inicializarMesas();
    }
  } else {
    this.inicializarMesas();
  }
}

inicializarMesas() {
  this.mesas = Array.from({ length: 15 }, (_, i) => ({
    numero: i + 1,
    vidas: 5
  }));
  this.guardarEstado();
}


  perderVida(mesa: any) {
    if (mesa.vidas > 0) {
      mesa.vidas--;
      this.guardarEstado();
    }
  }

  recargarUna(mesa: any) {
  if (mesa.vidas < 5) {
    mesa.vidas++;
    this.guardarEstado();
  }
}

  resetear() {
    this.mesas.forEach(m => m.vidas = 5);
    this.guardarEstado();
  }

  guardarEstado() {
    localStorage.setItem('estadoMesas', JSON.stringify(this.mesas));
  }
}
