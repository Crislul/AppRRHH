import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Salida, SalidaService } from '../../services/salida.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-salida-admin',
  imports: [CommonModule],
  templateUrl: './salida-admin.component.html',
  styleUrl: './salida-admin.component.css'
})
export class SalidaAdminComponent implements OnInit {

  salida: Salida | null = null;

  constructor(
    private route: ActivatedRoute,
    private salidaService: SalidaService
  ) {}

  descargarPDF(event: Event) {
    event.preventDefault();
    
    const elemento = document.getElementById('salidaPDF');
    if (!elemento) return;
  
    const ocultos = elemento.querySelectorAll('.oculto-para-pdf');
    ocultos.forEach(e => (e as HTMLElement).style.display = 'none');
  
    html2canvas(elemento).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg  0.5');
      const pdf = new jsPDF('p', 'mm', 'letter');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Salida.pdf');
  
      // Restaurar visibilidad
      ocultos.forEach(e => (e as HTMLElement).style.display = '');
    });
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarSalida(Number(id));
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
  }

  rechazarSalida(): void {
    this.actualizarEstatus(2);
  }
}
