import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SalidaService } from '../../services/salida.service';
import { SeguridadService } from '../../services/seguridad.service';

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
  selector: 'app-tabla-salidas-hoy-user',
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
  templateUrl: './tabla-salidas-hoy-user.component.html',
  styleUrl: './tabla-salidas-hoy-user.component.css'
})
export class TablaSalidasHoyUserComponent implements OnInit, AfterViewInit {

  seguridadService = inject(SeguridadService);
  
    idUsuario(): number{
      return this.seguridadService.obtenerId();
    }


 displayedColumns: string[] = ['areaNombre','categoriaNombre','fecha', 'acciones', 'estatusAdmin','estatusDir'];
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
        const userId = this.idUsuario();
      
        if (!userId || userId <= 0) {
          console.warn('ID de usuario no válido:', userId);
          this.dataSource.data = []; // No muestra nada
          return;
        }
      
        this.salidaService.getAutorizaciones().subscribe(
          (data) => {
            const today = new Date();
            const todayFormatted = new Intl.DateTimeFormat('es-MX', {
              timeZone: 'America/Mexico_City',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).format(today); // dd/mm/aaaa
      
            const filteredData = data.filter((autorizacion) => {
              return autorizacion.fecha === todayFormatted && autorizacion.usuarioId === userId;
            });
      
            this.dataSource.data = filteredData.sort((a, b) => b.id - a.id);
          },
          (error) => {
            console.error('Error al obtener las autorizaciones:', error);
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
         this.router.navigate(['/salidaUser', id,]);
       }
 

}
