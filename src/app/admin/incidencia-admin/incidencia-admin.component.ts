import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Incidencia, IncidenciaService } from '../../services/incidencia.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incidencia-admin',
  imports: [CommonModule],
  templateUrl: './incidencia-admin.component.html',
  styleUrl: './incidencia-admin.component.css'
})
export class IncidenciaAdminComponent implements OnInit{

  incidencia: Incidencia | null = null;

  constructor(
    private route: ActivatedRoute,
    private incidenciaService: IncidenciaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarIncidencia(Number(id));
    }
  }

  cargarIncidencia(id: number): void {
    this.incidenciaService.getIncidencia(id).subscribe(
      (data) => {
        this.incidencia = data;
      },
      (error) => {
        console.error('Error al obtener la incidencia:', error);
      }
    );
  }

  actualizarEstatus(estatus: number): void {
    if (!this.incidencia) return;

    const incidenciaActualizada: Incidencia = {
      ...this.incidencia,
      estatus: estatus
    };

    this.incidenciaService.updateIncidencia(this.incidencia.id, incidenciaActualizada).subscribe(
      () => {
        this.incidencia!.estatus = estatus;
      },
      (error) => {
        console.error('Error al actualizar el estatus:', error);
      }
    );
  }

  autorizarIncidencia(): void {
    this.actualizarEstatus(1);
  }

  rechazarIncidencia(): void {
    this.actualizarEstatus(2);
  }
}
