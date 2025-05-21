import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SeguridadService } from '../../services/seguridad.service';

export interface IncidenciaUser {
  id: number;
  descripcion: string;
  fecha: string;
  fechaInicio: string;
  fechaFin: string;
  usuarioId: number;
  usuarioNombre: string; 
  usuarioApellidoP: string;
  usuarioApellidoM: string;
  areaId: number;
  areaNombre: string;  
  categoriaId: number;
  categoriaNombre: string;  
  motivoId: number;
  motivoNombre: string;  
  estatusDir: number;
  estatusAdmin: number;
}

@Component({
  selector: 'app-tabla-incidencias-user',
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule, 
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './tabla-incidencias-user.component.html',
  styleUrl: './tabla-incidencias-user.component.css'
})
export class TablaIncidenciasUserComponent implements OnInit, AfterViewInit{

  seguridadService = inject(SeguridadService);

  idUsuario(): number{
    return this.seguridadService.obtenerId();
  }

  displayedColumns: string[] = ['areaNombre','categoriaNombre','motivoNombre','fecha', 'acciones', 'estatusAdmin','estatusDir'];
    dataSource = new MatTableDataSource<IncidenciaUser>([]);
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    constructor(
      private incidenciaService: IncidenciaService,
      private dialog: MatDialog, 
      private router: Router) {}
  
    ngOnInit(): void {
      this.getIncidencias();
    }
  
    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    getIncidencias(): void {

      if (this.idUsuario() === 0) {
        this.dataSource.data = []; // No mostrar nada si el usuario no tiene un ID válido
        return;
      }
    
      this.incidenciaService.getIncidencias(this.idUsuario()).subscribe(
        (data) => {
          this.dataSource.data = data.sort((a, b) => b.id - a.id); 
        },
        (error) => {
          console.error('Error al obtener las incidencias:', error);
        }
      );
    }
  
    aplicarFiltro(event: Event): void {
      const valorFiltro = (event.target as HTMLInputElement).value;
      this.dataSource.filter = valorFiltro.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  

    visualizarIncidencia(id: number)
    {
      this.router.navigate(['/incidenciaUser', id]);
    }

}
