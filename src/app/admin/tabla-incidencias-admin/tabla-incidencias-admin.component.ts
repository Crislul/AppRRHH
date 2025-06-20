import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { CommonModule } from '@angular/common';
import { TablaFiltroIncidenciasComponent } from "../tabla-filtro-incidencias/tabla-filtro-incidencias.component";

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
  selector: 'app-tabla-incidencias-admin',
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    TablaFiltroIncidenciasComponent
],
  templateUrl: './tabla-incidencias-admin.component.html',
  styleUrl: './tabla-incidencias-admin.component.css'
})


export class TablaIncidenciasAdminComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['usuarioNombre', 'usuarioApellidoP', 'usuarioApellidoM','areaNombre','categoriaNombre','fecha', 'acciones', 'estatusAdmin','estatusDir'];
    dataSource = new MatTableDataSource<Incidencia>([]);
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    constructor(
      private incidenciaService: IncidenciaService,
      private router: Router) {}
  
    ngOnInit(): void {
      
      this.getIncidencias();
      this.dataSource.filterPredicate = (data: Incidencia, filter: string) => {
    const dataStr = (
      data.usuarioNombre + ' ' +
      data.usuarioApellidoP + ' ' +
      data.usuarioApellidoM + ' ' +
      data.areaNombre + ' ' +
      data.categoriaNombre + ' ' +
      data.motivoNombre
    ).toLowerCase();

    return dataStr.indexOf(filter) !== -1;
  };
    }
  
    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    getIncidencias(): void {
      this.incidenciaService.getIncidencias().subscribe(
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
      this.router.navigate(['/incidencia', id,]);
    }
}



