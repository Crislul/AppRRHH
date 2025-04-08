import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SeguridadService } from '../../services/seguridad.service';
import { SalidaService } from '../../services/salida.service';
import { Router } from '@angular/router';

export interface SalidaUser{
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
    
  estatus: number;
}

@Component({
  selector: 'app-tabla-salidas-user',
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
  templateUrl: './tabla-salidas-user.component.html',
  styleUrl: './tabla-salidas-user.component.css'
})
export class TablaSalidasUserComponent implements OnInit, AfterViewInit{

  seguridadService = inject(SeguridadService);

  idUsuario(): number{
    return this.seguridadService.obtenerId();
  }



  displayedColumns: string[] = ['areaNombre','categoriaNombre','fecha', 'acciones', 'estatus'];
      dataSource = new MatTableDataSource<SalidaUser>([]);
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;


      constructor(
            private salidaService: SalidaService,
            private dialog: MatDialog, 
            private router: Router) {}

            ngOnInit(): void {
              this.getAutorizaciones();
            }
          
            ngAfterViewInit(): void {
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }


            getAutorizaciones(): void {

              if (this.idUsuario() === 0) {
                this.dataSource.data = []; // No mostrar nada si el usuario no tiene un ID válido
                return;
              }
            
              this.salidaService.getAutorizaciones(this.idUsuario()).subscribe(
                (data) => {
                  this.dataSource.data = data.sort((a, b) => b.id - a.id); 
                },
                (error) => {
                  console.error('Error al obtener las Autorizaciones:', error);
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
          
        
            visualizarSalida(id: number)
            {
              this.router.navigate(['/salidaUser', id]);
            }

}
