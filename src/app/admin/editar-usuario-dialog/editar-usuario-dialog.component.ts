import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../tabla-usuarios-admin/tabla-usuarios-admin.component';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';


interface Food {
  value: number;
  viewValue: string;
  
}


@Component({
  selector: 'app-editar-usuario-dialog',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatDialogContent,
    MatFormFieldModule,
    MatLabel,
    ReactiveFormsModule,
    MatDialogActions,
    MatAutocompleteModule,
    MatSelectModule,
    FormsModule],
  templateUrl: './editar-usuario-dialog.component.html',
  styleUrls: ['./editar-usuario-dialog.component.css']
})
export class EditarUsuarioDialogComponent {
  usuarioForm: FormGroup;

  selectedValue: number;



  foods: Food[] = [
    {value: 1, viewValue: 'Usuario'},
    {value: 2, viewValue: 'Administrador'},
  ];

  
  
  constructor(
    public dialogRef: MatDialogRef<EditarUsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuario,
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) 
  
  {
    this.usuarioForm = this.fb.group({
      nombre: [usuario.nombre, Validators.required],
      apellidoP: [usuario.apellidoP, Validators.required],
      apellidoM: [usuario.apellidoM, Validators.required],
      correo: [usuario.correo, [Validators.required, Validators.email]],
      contrasenaHash: [usuario.contrasenaHash, [Validators.required, Validators.required]],
      tipoUsuario: [usuario.tipoUsuario, Validators.required]
    });

    this.selectedValue = this.usuarioForm.get('tipoUsuario')?.value || 1;


  }

  guardarCambios(): void {
    if (this.usuarioForm.valid) {
      
      const usuarioActualizado = { ...this.usuario, ...this.usuarioForm.value };
      //console.log('Datos enviados a la API:', usuarioActualizado);

      this.usuarioService.editarUsuario(usuarioActualizado).subscribe(
        () => {
          this.dialogRef.close(usuarioActualizado);
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
