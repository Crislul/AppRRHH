import { Component, inject, Input, OnInit } from '@angular/core';
import { SeguridadService } from '../../services/seguridad.service';
import { Notificacion, NotificacionesService } from '../../services/notificaciones.service';
import { interval, Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-toolbar-director',
standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './toolbar-director.component.html',
  styleUrl: './toolbar-director.component.css'
})
export class ToolbarDirectorComponent implements OnInit {

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
  
    if (usuarioId) {
      this.cargarNotificaciones(usuarioId); // carga inicial
  
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
    this.notificacionesService.getNotificaciones().subscribe({ // solicitudes para el admin
      next: (pendientes) => {
        this.notificacionesService.getNotificacionesPorUsuario(usuarioId).subscribe({ // respuestas para el mismo admin si hizo una solicitud
          next: (respuestas) => {
            this.notificaciones = [...pendientes, ...respuestas.filter(r => r.estado === 'pendiente')];
          },
          error: (err) => {
            console.error('Error al obtener notificaciones de respuesta:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener notificaciones pendientes:', err);
      }
    });
    
  }
  
  
  
  irAVista(noti: Notificacion) {
    const tipo = noti.tipoPermiso?.toLowerCase();
    const id = noti.permisoId;
  
    if (tipo && id) {
      if (noti.tipo === 'respuesta') {
        this.notificacionesService.eliminarnotificacion(noti.id).subscribe(() => {
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
