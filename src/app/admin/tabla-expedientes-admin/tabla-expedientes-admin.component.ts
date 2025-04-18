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
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-tabla-expedientes-admin',
  imports: [
    MatTableModule,
    MatFormFieldModule, 
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    
  ],
  templateUrl: './tabla-expedientes-admin.component.html',
  styleUrl: './tabla-expedientes-admin.component.css',
  standalone: true,
})


export class TablaExpedientesAdminComponent implements OnInit, AfterViewInit{
  usuarioId: string | null = null;
  displayedColumns: string[] = ['nombre', 'apellidoP', 'apellidoM', 'correo','acciones'];
  dataSource = new MatTableDataSource<Usuario>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService, 
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.paramMap.get('id');    
  console.log('ID del usuario:', this.usuarioId);
  
  this.obtenerUsuarios();
  this.usuarioService.obtenerUsuarios().subscribe(
    (data) => {
      console.log('Usuarios obtenidos:', data); // 👈 Revisa que no venga vacío
      this.dataSource.data = data.sort((a, b) => b.id - a.id);
    },
    (error) => {
      console.error('Error al obtener usuarios:', error);
    }
  );
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

  visualizarExpediente(id: number) {
    this.router.navigate(['/expedientevistaadmin', id]);
  }
  
  
}
