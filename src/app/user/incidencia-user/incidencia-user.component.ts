import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incidencia-user',
  imports: [CommonModule],
  templateUrl: './incidencia-user.component.html',
  styleUrl: './incidencia-user.component.css'
})
export class IncidenciaUserComponent implements OnInit{

  incidencia: any;

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

  visualizarArchivo(): void {
    if (!this.incidencia?.id) return;
  
    const fileUrl = `https://localhost:7064/api/incidencia/descargar-archivo/${this.incidencia.id}`;
    window.open(fileUrl, '_blank');

  }

}
