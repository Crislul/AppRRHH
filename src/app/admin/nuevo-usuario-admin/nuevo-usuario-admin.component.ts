import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-usuario-admin',
  standalone: true, // 👈 Necesario si usas imports en `@Component`
  imports: [FormsModule],
  templateUrl: './nuevo-usuario-admin.component.html',
  styleUrl: './nuevo-usuario-admin.component.css'
})
export class NuevoUsuarioAdminComponent {
  id: number = 0;
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  correo: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  tipoUsuario: number = 1;

  constructor(private usuarioService: UsuarioService) {}

  // Variables


// Método para generar la contraseña
generateRandomPassword(length: number = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}

// Asignar la contraseña generada
setRandomPassword(): void {
  const generated = this.generateRandomPassword();
  this.contrasena = generated;
  this.confirmarContrasena = generated;
}

  crearUsuario() {
   
    if (!this.nombre || !this.apellidoPaterno || !this.apellidoMaterno || !this.correo || !this.contrasena) {
      Swal.fire({
        title: 'Error',
        text: '❌ Todos los campos son obligatorios',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo);
    if (!correoValido) {
      Swal.fire({
        title: 'Correo inválido',
        text: '❌ Ingresa un correo electrónico válido ',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.contrasena !== this.confirmarContrasena) {
      Swal.fire({
        title: 'Error',
        text: '❌ Las contraseñas no coinciden',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    
    const usuario = {
      id: this.id,
      nombre: this.nombre,
      apellidoP: this.apellidoPaterno, // 🔹 Asegúrate de que coincida con la API
      apellidoM: this.apellidoMaterno,
      correo: this.correo,
      contrasenaHash: this.contrasena, // 🔹 Debe coincidir con el backend
      tipoUsuario: this.tipoUsuario
    };

    this.usuarioService.crearUsuario(usuario).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Usuario Creado!',
          text: 'El usuario ha sido registrado con éxito.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // 🔹 Limpiar los valores del formulario
          this.id = 0;
          this.nombre = '';
          this.apellidoPaterno = '';
          this.apellidoMaterno = '';
          this.correo = '';
          this.contrasena = '';
          this.confirmarContrasena = '';
        });
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        Swal.fire({
          title: 'Error',
          text: '❌ Hubo un problema al crear el usuario. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
