import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-incidencia-user',
  imports: [CommonModule],
  templateUrl: './incidencia-user.component.html',
  styleUrl: './incidencia-user.component.css'
})
export class IncidenciaUserComponent implements OnInit{

  incidencia: any;

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

  visualizarArchivo(): void {
    if (!this.incidencia?.id) return;
  
    const fileUrl = `https://localhost:7064/api/incidencia/descargar-archivo/${this.incidencia.id}`;
    window.open(fileUrl, '_blank');

  }

}
