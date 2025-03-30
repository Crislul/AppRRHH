import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Salida, SalidaService } from '../../services/salida.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-salida-admin',
  imports: [CommonModule],
  templateUrl: './salida-admin.component.html',
  styleUrl: './salida-admin.component.css'
})
export class SalidaAdminComponent implements OnInit{

  salida: Salida | null = null;

  constructor (
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
        console.error('Error al obtener la incidencia:', error);
      }
    );
  }

  actualizarEstatus(estatus: number): void {
      if (!this.salida) return;
  
      const incidenciaActualizada: Salida = {
        ...this.salida,
        estatus: estatus
      };


      this.salidaService.updateAutorizacion(this.salida.id, incidenciaActualizada).subscribe(
        () => {
          this.salida!.estatus = estatus;
        },
        (error) => {
          console.error('Error al actualizar el estatus:', error);
        }
      );
    }


    autorizarSalida(): void {
      this.actualizarEstatus(1);
    }
  
    rechazarSalida(): void {
      this.actualizarEstatus(2);
    }

}
