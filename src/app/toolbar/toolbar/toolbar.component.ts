import {Component, inject, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {Router, RouterModule } from '@angular/router';
import {CommonModule } from '@angular/common';
import {MatMenuModule } from '@angular/material/menu';
import { SeguridadService } from '../../services/seguridad.service';
import { NotificacionesService, Notificacion } from '../../services/notificaciones.service';
import { interval, Subscription } from 'rxjs';
import { Input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnInit {

  seguridadService = inject(SeguridadService);
  notificaciones: Notificacion[] = [];
  private pollingSub!: Subscription;
  mostrarMenu: boolean = false;
  @Input() rol: string = '';

  constructor(
    private router: Router,
    private notificacionesService: NotificacionesService
  ) {}

rolUsuario: string = '';

ngOnInit(): void {
  const usuarioId = Number(localStorage.getItem('usuarioId'));
  this.rolUsuario = localStorage.getItem('rol') || '';
    console.log('Rol del usuario:', this.rolUsuario);

  if (usuarioId && this.rolUsuario === '2') {
    this.cargarNotificaciones(usuarioId);

    this.pollingSub = interval(10000).subscribe(() => {
      this.cargarNotificaciones(usuarioId);
    });
  }
}

  
  
  ngOnDestroy(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  nombreUsuario(): string {
    return this.seguridadService.obtenerNombre();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  help() {
    this.router.navigate(['/Help']);
  }

  editUser() {
    this.router.navigate(['/configuracion']);
  }
 cargarNotificaciones(usuarioId: number) {
  const rol = Number(this.rolUsuario);

  this.notificacionesService.getNotificacionesPorRol(rol).subscribe({
    next: (solicitudes) => {
      this.notificacionesService.getNotificacionesPorUsuario(usuarioId).subscribe({
        next: (respuestas) => {
          this.notificaciones = [
            ...solicitudes.filter(n => n.estado === 'pendiente'),
            ...respuestas.filter(n => n.estado === 'pendiente')
          ];
          console.log('Notificaciones combinadas:', this.notificaciones);
        },
        
        error: (err) => {
          console.error('Error al obtener notificaciones de respuesta:', err);
        }
      });
    },
    error: (err) => {
      console.error('Error al obtener notificaciones por rol:', err);
    }
  });
}

  
  
  
  irAVista(noti: Notificacion) {
    const tipo = noti.tipoPermiso?.toLowerCase();
    const id = noti.permisoId;
  
    if (tipo && id) {
      if (noti.tipo === 'respuesta') {
        this.notificacionesService.marcarNotificacionComoLeida(noti.id).subscribe(() => {
          this.router.navigate([`/${tipo}`, id]);
        });
      } else {
        this.router.navigate([`/${tipo}`, id], {
          state: { notificacionId: noti.id }
        });
      }
    } else {
      console.warn('Notificación sin tipo o id de referencia');
    }
  }
  
  
  
  
  
}
