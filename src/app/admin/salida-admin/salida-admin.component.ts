import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Salida, SalidaService } from '../../services/salida.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { NotificacionesService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-salida-admin',
  imports: [CommonModule],
  templateUrl: './salida-admin.component.html',
  styleUrl: './salida-admin.component.css'
})
export class SalidaAdminComponent implements OnInit {
  notificacionId: number | null = null;// el id de la notificacion
  salida: Salida | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salidaService: SalidaService,
    private notificacionesService: NotificacionesService,
    
  ) {}

  descargarPDF(event: Event) {
    event.preventDefault();
  
    const elemento = document.getElementById('salidaPDF');
    if (!elemento) return;
  
    // Ocultar botones y aplicar clase de estilo para el PDF
    const ocultos = elemento.querySelectorAll('.oculto-para-pdf');
    ocultos.forEach(e => (e as HTMLElement).style.display = 'none');
    elemento.classList.add('pdf-export'); // <-- clase de estilo uniforme
  
    html2canvas(elemento, {
      scale: 3, // mejor calidad de imagen
      backgroundColor: '#ffffff',
      useCORS: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 1.0); // calidad máxima
      const pdf = new jsPDF('p', 'mm', 'letter');
    
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('salida_' + (this.salida?.usuarioNombre ?? 'sin_id') + '.pdf');
    
      // Restaurar visibilidad y estilos
      ocultos.forEach(e => (e as HTMLElement).style.display = '');
      elemento.classList.remove('pdf-export');
    });
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarSalida(Number(id));
    }
    const state = history.state;
    if (state?.notificacionId) {
      this.notificacionId = state.notificacionId;
      console.log('Notificación ID desde state:', this.notificacionId);
    } else {
      console.log('Notificación ID desde state: null');
    }
  }

  cargarSalida(id: number): void {
    this.salidaService.getAutorizacion(id).subscribe(
      (data) => {
        this.salida = data;
      },
      (error) => {
        console.error('Error al obtener la incidencia:', error);
      }
    );
  }

  actualizarEstatus(estatus: number): void {
    if (!this.salida) return;

    const salidaActualizada: Salida = {
      ...this.salida,
      estatus: estatus
    };

    this.salidaService.updateAutorizacion(this.salida.id, salidaActualizada).subscribe(
      () => {
        this.salida!.estatus = estatus;
        this.mostrarAlerta(estatus);
      },
      (error) => {
        console.error('Error al actualizar el estatus:', error);
      }
    );
  }

  mostrarAlerta(estatus: number): void {
    if (estatus === 1) {
      Swal.fire('Éxito', 'La salida ha sido autorizada.', 'success');
    } else if (estatus === 2) {
      Swal.fire('Rechazada', 'La salida ha sido rechazada.', 'error');
    }
  }

  autorizarSalida(): void {
    this.actualizarEstatus(1);
    if (this.notificacionId) {
      this.notificacionesService.eliminarnotificacion(this.notificacionId).subscribe(() => {
        console.log('Notificación eliminada correctamente');
      });
    } else {
      console.warn('No se encontró ID de notificación');
    }
  }

  rechazarSalida(): void {
    this.actualizarEstatus(2);
    if (this.notificacionId) {
      this.notificacionesService.eliminarnotificacion(this.notificacionId).subscribe(() => {
        console.log('Notificación eliminada correctamente');
      });
    } else {
      console.warn('No se encontró ID de notificación');
    }
  }
}
