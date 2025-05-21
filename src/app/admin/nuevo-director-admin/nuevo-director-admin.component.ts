import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { IncidenciaService } from '../../services/incidencia.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nuevo-director-admin',
  imports: [FormsModule, CommonModule],
  templateUrl: './nuevo-director-admin.component.html',
  styleUrl: './nuevo-director-admin.component.css'
})
export class NuevoDirectorAdminComponent implements OnInit{

  areas: any[] = [];


  id: number = 0;
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  correo: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  areaId: number = 0;
  tipoUsuario: number = 3;


  constructor(private usuarioService: UsuarioService, private incidenciaService: IncidenciaService) {}

  ngOnInit() {
    this.incidenciaService.getAreas().subscribe(data => (this.areas = data));
}

  

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
   
    if (!this.nombre || !this.apellidoPaterno || !this.apellidoMaterno || !this.correo || !this.contrasena || !this.areaId) {
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
      areaId: this.areaId,
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
          this.areaId = 0;
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
