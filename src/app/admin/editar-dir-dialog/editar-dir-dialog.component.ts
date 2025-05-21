import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../tabla-usuarios-admin/tabla-usuarios-admin.component';
import { IncidenciaService } from '../../services/incidencia.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-dir-dialog',
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
    FormsModule,
    CommonModule
  ],
  templateUrl: './editar-dir-dialog.component.html',
  styleUrl: './editar-dir-dialog.component.css'
})
export class EditarDirDialogComponent implements OnInit {

  areas: any[] = [];
  areaId: number = 0;

  usuarioForm: FormGroup;


  
  
  constructor(
    public dialogRef: MatDialogRef<EditarDirDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuario,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private incidenciaService: IncidenciaService
  ) 

  {
    this.usuarioForm = this.fb.group({
      nombre: [usuario.nombre, Validators.required],
      apellidoP: [usuario.apellidoP, Validators.required],
      apellidoM: [usuario.apellidoM, Validators.required],
      correo: [usuario.correo, [Validators.required, Validators.email]],
      contrasenaHash: [usuario.contrasenaHash, [Validators.required, Validators.required]],
      tipoUsuario: [usuario.tipoUsuario, Validators.required],
      areaId: [this.areaId, Validators.required]
    });


  }

  ngOnInit() {
    this.incidenciaService.getAreas().subscribe(data => (this.areas = data));
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
