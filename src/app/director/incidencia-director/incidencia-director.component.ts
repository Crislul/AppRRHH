import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Incidencia, IncidenciaService } from '../../services/incidencia.service';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { NotificacionesService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-incidencia-director',
  imports: [CommonModule],
  templateUrl: './incidencia-director.component.html',
  styleUrl: './incidencia-director.component.css'
})
export class IncidenciaDirectorComponent implements OnInit {

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

  actualizarEstatus(estatusDir: number): void {
    if (!this.incidencia) return;

    const incidenciaActualizada: Incidencia = {
      ...this.incidencia,
      estatusDir: estatusDir
    };

    this.incidenciaService.updateIncidencia(this.incidencia.id, incidenciaActualizada).subscribe(
      () => {
        this.incidencia!.estatusDir = estatusDir;
        this.mostrarAlerta(estatusDir);
      },
      (error) => {
        console.error('Error al actualizar el estatus:', error);
      }
    );
  }

  mostrarAlerta(estatusDir: number): void {
    if (estatusDir === 1) {
      Swal.fire('Éxito', 'La incidencia ha sido autorizada.', 'success');
    } else if (estatusDir === 2) {
      Swal.fire('Rechazada', 'La incidencia ha sido rechazada.', 'error');
    }
  }
  autorizarIncidencia(): void {
  
    this.actualizarEstatus(1); 
    if (this.notificacionId !== null) {
      this.notificacionesService.marcarNotificacionComoLeida(this.notificacionId).subscribe(() => {
        console.log('Notificación eliminada correctamente');
      });
    } else {
      console.warn('No se encontró ID de notificación');
    }
  }
  
  rechazarIncidencia(): void {
    this.actualizarEstatus(2); 
    if (this.notificacionId !== null) {
      this.notificacionesService.marcarNotificacionComoLeida(this.notificacionId).subscribe(() => {
        console.log('Notificación leida correctamente');
      });
    } else {
      console.warn('No se encontró ID de notificación');
    }
  }
  
  


  visualizarArchivo(): void {
    if (!this.incidencia?.id) return;
  
    const fileUrl = `https://apirrhh.onrender.com/api/incidencia/descargar-archivo/${this.incidencia.id}`;
    window.open(fileUrl, '_blank');

  }


  

}
