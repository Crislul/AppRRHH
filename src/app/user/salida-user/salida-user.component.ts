import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SalidaService } from '../../services/salida.service';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-salida-user',
  imports: [CommonModule],
  templateUrl: './salida-user.component.html',
  styleUrl: './salida-user.component.css'
})
export class SalidaUserComponent implements OnInit{

  salida: any;

  constructor(
      private route: ActivatedRoute,
      private salidaService: SalidaService
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
  }

  cargarSalida(id: number): void {
    this.salidaService.getAutorizacion(id).subscribe(
      (data) => {
        this.salida = data;
      },
      (error) => {
        console.error('Error al obtener la Autorización:', error);
      }
    );
  }

}
