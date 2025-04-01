import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario.service';
import { EditarUsuarioDialogComponent } from '../editar-usuario-dialog/editar-usuario-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';

export interface Usuario {
 // id: number;
  nombre: string;
  apellidoP: string;
  apellidoM: string;
  correo: string;
  contrasenaHash: string;
  tipoUsuario: number;
}

@Component({
  selector: 'app-tabla-usuarios-admin',
  imports: [
    MatTableModule,
    MatFormFieldModule, 
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule],
  templateUrl: './tabla-usuarios-admin.component.html',
  styleUrls: ['./tabla-usuarios-admin.component.css']
})
export class TablaUsuariosAdminComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre', 'apellidoP', 'apellidoM', 'correo','acciones', 'acciones2'];
  dataSource = new MatTableDataSource<Usuario>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private usuarioService: UsuarioService, private dialog: MatDialog) {}

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

  eliminarUsuario(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '⚠️ Esta acción eliminará al usuario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(id).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El usuario ha sido eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.obtenerUsuarios(); // Recargar la lista
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            Swal.fire({
              title: 'Error',
              text: '❌ No se pudo eliminar el usuario. Inténtalo de nuevo.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }
  

  editarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(EditarUsuarioDialogComponent, {
      width: '400px',
     // height: 'auto',
      data: usuario,
      disableClose: true, // Opcional: evita que el usuario cierre el diálogo haciendo clic fuera
      autoFocus: true // Asegura que el foco esté dentro del diálogo
      
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerUsuarios(); // Recargar la tabla después de la edición
      }
    });
  }
}


  



