import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-expediente-user',
  imports: [CommonModule],
  templateUrl: './expediente-user.component.html',
  styleUrl: './expediente-user.component.css'
})
export class ExpedienteUserComponent {

  imageUrl: string = 'assets/default-profile.png'; // Imagen inicial
  showIcon: boolean = false; // Controla la visibilidad del icono

  // Referencia al input de archivos
  openFileInput() {
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    fileInput?.click();
  }

  // Evento cuando se selecciona una nueva imagen
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.imageUrl = e.target.result as string;
        }
      };

      reader.readAsDataURL(file); // Convierte la imagen a una URL base64
    }
  }

}
