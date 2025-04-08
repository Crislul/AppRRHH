import { Component, inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { SeguridadService } from '../../services/seguridad.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-usuario-user',
  imports: [FormsModule
    
  ],
  templateUrl: './usuario-user.component.html',
  styleUrl: './usuario-user.component.css'
})

export class UsuarioUserComponent {

  usuario: Usuario = {
    id: 0,
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    correo: '',
    contrasenaHash: '',
    tipoUsuario: 1
  };

  private seguridadService = inject(SeguridadService);

  constructor(
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    const id = this.idUsuario();
    this.obtenerUsuario(id);
  }

  idUsuario(): number {
    return this.seguridadService.obtenerId(); // Llamar al método que obtiene el ID del usuario
  }

  obtenerUsuario(id: number): void {
    // Aquí deberías tener un método en tu servicio para obtener un usuario por su ID
    this.usuarioService.obtenerUsuarios().subscribe((usuarios) => {
      this.usuario = usuarios.find(u => u.id === id)!;
    });
  }

  guardarCambios(): void {
    this.usuarioService.editarUsuario(this.usuario).subscribe(
      (response) => {
         Swal.fire({
                 title: '¡Usuario Actualizado!',
                 text: 'Usuario actualizado correctamente',
                 icon: 'success',
                 confirmButtonText: 'OK'
               })
      },
      (error) => {
        console.error('Error al actualizar el usuario', error);
      }
    );
  }
}

