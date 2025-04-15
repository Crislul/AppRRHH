import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SeguridadService } from '../../services/seguridad.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = signal(true);
  loading = signal(false);
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private seguridadService: SeguridadService
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  
  nombreUsuario(): string{
    return this.seguridadService.obtenerNombre();
  }
  async login() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.errorMessage = '';

    const { correo, contrasena } = this.loginForm.value;

    this.seguridadService.login(correo, contrasena).subscribe({
      next: async (resp) => {
        this.loading.set(false);

        if (resp.autenticado) {
          localStorage.setItem('usuarioId', String(resp.id)); // id usuario
          // Esperar a que el usuario cierre la alerta antes de continuar
          await Swal.fire({
            title: 'Bienvenido',
            text: `Hola, ${this.nombreUsuario()}! Te has autenticado correctamente.`,
            icon: 'success',
            timer: 2000,
          showConfirmButton: false
                  });
  
          // Redirigir después de que el usuario cierre la alerta
          setTimeout(() => {
            if (resp.tipoUsuario === 1) {
              this.router.navigate(['/index']);
            } else {
              this.router.navigate(['/indexAdmin']);
            }
          }, 200);
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Credenciales incorrectas o usuario no registrado.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      },
      error: (err) => {
        this.loading.set(false);
        Swal.fire({
          title: 'Error',
          text: err.error || 'Error en el inicio de sesión.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
