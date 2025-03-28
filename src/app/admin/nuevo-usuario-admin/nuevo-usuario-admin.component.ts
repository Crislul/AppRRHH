import { Component} from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-nuevo-usuario-admin',
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
  tipoUsuario: number = 1 ;


  constructor(private usuarioService: UsuarioService ) {}

  crearUsuario() {
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
      apellidoP: this.apellidoPaterno,
      apellidoM: this.apellidoMaterno,
      correo: this.correo,
      contrasenaHash: this.contrasena,
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
