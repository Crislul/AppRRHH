import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { SeguridadService } from '../../services/seguridad.service';

export interface Incidencia {
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
  selector: 'app-tabla-incidencias-director',
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
  templateUrl: './tabla-incidencias-director.component.html',
  styleUrl: './tabla-incidencias-director.component.css'
})
export class TablaIncidenciasDirectorComponent implements OnInit, AfterViewInit{

  seguridadService = inject(SeguridadService);
    
      idAreaUser(): number{
        return this.seguridadService.obtenerAreaUser();
      }

      
  
  displayedColumns: string[] = ['usuarioNombre', 'usuarioApellidoP', 'usuarioApellidoM','areaNombre','categoriaNombre','fecha', 'acciones', 'estatusAdmin','estatusDir'];
    dataSource = new MatTableDataSource<Incidencia>([]);
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    constructor(
      private incidenciaService: IncidenciaService,
      private router: Router) {}
  
    ngOnInit(): void {
      this.getIncidencias();
    }
  
    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    getIncidencias(): void {

      this.incidenciaService.getIncidencias().subscribe(
        (data) => {
          
          const userId = this.idAreaUser();
    
          if (!userId || userId <= 0) {
            console.warn('ID de area no válido:', userId);
            this.dataSource.data = []; // No muestra nada
            return;
          }
    
          const filteredData = data.filter((incidencia) => {
            return incidencia.areaId === userId;
          });
    
          this.dataSource.data = filteredData.sort((a, b) => b.id - a.id);
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
      this.router.navigate(['/incidenciaDir', id,]);
    }

}
