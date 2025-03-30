import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../tabla-usuarios-admin/tabla-usuarios-admin.component';
import { Router } from '@angular/router';





@Component({
  selector: 'app-tabla-expedientes-admin',
  imports: [
    MatTableModule,
    MatFormFieldModule, 
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './tabla-expedientes-admin.component.html',
  styleUrl: './tabla-expedientes-admin.component.css'
})


export class TablaExpedientesAdminComponent implements OnInit, AfterViewInit{
  
  displayedColumns: string[] = ['nombre', 'apellidoP', 'apellidoM', 'correo','acciones'];
  dataSource = new MatTableDataSource<Usuario>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService, 
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(
      (data) => {
        this.dataSource.data = data.sort((a, b) => b.id - a.id);
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
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

  

  visualizarExpediente()
    {
      this.router.navigate(['/expediente']);
    }


    //visualizarExpediente(id: number)
    //{
      //this.router.navigate(['/expediente', id,]);
    //}

  
}
