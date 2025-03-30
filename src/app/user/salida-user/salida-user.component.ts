import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SalidaService } from '../../services/salida.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-salida-user',
  imports: [CommonModule],
  templateUrl: './salida-user.component.html',
  styleUrl: './salida-user.component.css'
})
export class SalidaUserComponent implements OnInit{

  salida: any;

  constructor(
      private route: ActivatedRoute,
      private salidaService: SalidaService
    ) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarSalida(Number(id));
    }
  }

  cargarSalida(id: number): void {
    this.salidaService.getAutorizacion(id).subscribe(
      (data) => {
        this.salida = data;
      },
      (error) => {
        console.error('Error al obtener la Autorización:', error);
      }
    );
  }

}
