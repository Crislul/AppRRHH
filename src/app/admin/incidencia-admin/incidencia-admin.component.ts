import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incidencia, IncidenciaService } from '../../services/incidencia.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Notificacion, NotificacionesService } from '../../services/notificaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incidencia-admin',
  imports: [CommonModule],
  templateUrl: './incidencia-admin.component.html',
  styleUrl: './incidencia-admin.component.css'
})
export class IncidenciaAdminComponent implements OnInit {
    notificacionId: number | null = null;// el id de la notificacion
      incidencia: Incidencia | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidenciaService: IncidenciaService,
    private notificacionesService: NotificacionesService,
    
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarIncidencia(Number(id));
    }
    
    const state = history.state;
    if (state?.notificacionId) {
      this.notificacionId = state.notificacionId;
      console.log('Notificación ID desde state:', this.notificacionId);
    } else {
      console.log('Notificación ID desde state: null');
    }
  }
  

  descargarPDF(event: Event) {
    event.preventDefault();
  
    const elemento = document.getElementById('incidenciaPDF');
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
      pdf.save('incidencia_' + (this.incidencia?.usuarioNombre ?? 'sin_id') +'.pdf');
    
      // Restaurar visibilidad y estilos
      ocultos.forEach(e => (e as HTMLElement).style.display = '');
      elemento.classList.remove('pdf-export');
    });
  }
  
  cargarIncidencia(id: number): void {
    this.incidenciaService.getIncidencia(id).subscribe(
      (data) => {
        this.incidencia = data;
      },
      (error) => {
        console.error('Error al obtener la incidencia:', error);
      }
    );
  }

  actualizarEstatus(estatus: number): void {
    if (!this.incidencia) return;

    const incidenciaActualizada: Incidencia = {
      ...this.incidencia,
      estatus: estatus
    };

    this.incidenciaService.updateIncidencia(this.incidencia.id, incidenciaActualizada).subscribe(
      () => {
        this.incidencia!.estatus = estatus;
        this.mostrarAlerta(estatus);
      },
      (error) => {
        console.error('Error al actualizar el estatus:', error);
      }
    );
  }

  mostrarAlerta(estatus: number): void {
    if (estatus === 1) {
      Swal.fire('Éxito', 'La incidencia ha sido autorizada.', 'success');
    } else if (estatus === 2) {
      Swal.fire('Rechazada', 'La incidencia ha sido rechazada.', 'error');
    }
  }
  autorizarIncidencia(): void {
  
    this.actualizarEstatus(1); 
    if (this.notificacionId) {
      this.notificacionesService.eliminarnotificacion(this.notificacionId).subscribe(() => {
        console.log('Notificación eliminada correctamente');
      });
    } else {
      console.warn('No se encontró ID de notificación');
    }
  }
  
  rechazarIncidencia(): void {
    this.actualizarEstatus(2); 
    if (this.notificacionId !== null) {
      this.notificacionesService.eliminarnotificacion(this.notificacionId).subscribe(() => {
        console.log('Notificación eliminada');
      });
    }
  }
  
  


  visualizarArchivo(): void {
    if (!this.incidencia?.id) return;
  
    const fileUrl = `https://localhost:7064/api/incidencia/descargar-archivo/${this.incidencia.id}`;
    window.open(fileUrl, '_blank');

  }
}
