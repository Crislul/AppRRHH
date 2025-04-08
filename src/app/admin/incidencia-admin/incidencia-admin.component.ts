import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Incidencia, IncidenciaService } from '../../services/incidencia.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-incidencia-admin',
  imports: [CommonModule],
  templateUrl: './incidencia-admin.component.html',
  styleUrl: './incidencia-admin.component.css'
})
export class IncidenciaAdminComponent implements OnInit {

  incidencia: Incidencia | null = null;

  constructor(
    private route: ActivatedRoute,
    private incidenciaService: IncidenciaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarIncidencia(Number(id));
    }
  }

  descargarPDF(event: Event) {
    event.preventDefault();
    
    const elemento = document.getElementById('incidenciaPDF');
    if (!elemento) return;
  
    const ocultos = elemento.querySelectorAll('.oculto-para-pdf');
    ocultos.forEach(e => (e as HTMLElement).style.display = 'none');
  
    html2canvas(elemento).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg 0.5');
      const pdf = new jsPDF('p', 'mm', 'letter');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('incidencia.pdf');
  
      // Restaurar visibilidad
      ocultos.forEach(e => (e as HTMLElement).style.display = '');
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
  }

  rechazarIncidencia(): void {
    this.actualizarEstatus(2);
  }

  


  visualizarArchivo(): void {
    if (!this.incidencia?.id) return;
  
    const fileUrl = `https://localhost:7064/api/incidencia/descargar-archivo/${this.incidencia.id}`;
    window.open(fileUrl, '_blank');

  }
}
