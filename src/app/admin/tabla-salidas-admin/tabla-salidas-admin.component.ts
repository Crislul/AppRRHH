import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SalidaService } from '../../services/salida.service';
import { TablaFiltroSalidasComponent } from "../tabla-filtro-salidas/tabla-filtro-salidas.component";

export interface Salida{
  id: number;

  horaSalida: string;
  horaEntrada: string;
  horarioTrabajo: string;
  
  asunto: string;
  fecha: string;

  usuarioId: number;
  usuarioNombre: string; 
  usuarioApellidoP: string; 
  usuarioApellidoM: string; 

  areaId: number;
  areaNombre: string;  

  categoriaId: number;
  categoriaNombre: string;  
    
  estatusDir: number;
  estatusAdmin: number;
}

@Component({
  selector: 'app-tabla-salidas-admin',
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    TablaFiltroSalidasComponent
],
  templateUrl: './tabla-salidas-admin.component.html',
  styleUrl: './tabla-salidas-admin.component.css'
})
export class TablaSalidasAdminComponent implements OnInit, AfterViewInit{


  displayedColumns: string[] = ['usuarioNombre', 'usuarioApellidoP', 'usuarioApellidoM','areaNombre','categoriaNombre','fecha', 'acciones', 'estatusAdmin', 'estatusDir'];
      dataSource = new MatTableDataSource<Salida>([]);
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;
    
      constructor(
        private salidaService: SalidaService,
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
        this.salidaService.getAutorizaciones().subscribe(
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
        this.router.navigate(['/salida', id,]);
      }
  
}
