import { Component, inject, OnInit } from '@angular/core';
import { ExpedienteService } from '../../services/expendiente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SeguridadService } from '../../services/seguridad.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-expediente-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './expediente-admin.component.html',
  styleUrl: './expediente-admin.component.css'
})
export class ExpedienteAdminComponent {
 documentos: any[] = [];
  fotoSeleccionada: File | null = null;
  nuevosDocumentos: any[] = [];

  nombre: string = localStorage.getItem('nombre') || '';
  apellido: string = localStorage.getItem('apellidoP') || '';
  apellidoM: string = localStorage.getItem('apellidoM') || '';
  editando: boolean = false;
  showIcon: any;
  seguridadService = inject(SeguridadService);
  usuarioService = inject(UsuarioService);
  fotoId: number | null = null;
  fotoUrl: string = 'assets/default-user.jpg';
  usuarioId: number = 0;

  constructor
  (
    private expedienteService: ExpedienteService,
    private route: ActivatedRoute 
  ) {}

  private documentosCargados = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
  
    if (idParam) {
      this.usuarioId = +idParam;
     // ✅ Aquí es donde agregas la petición para traer el nombre del usuario por ID
     this.usuarioService.obtenerUsuarioPorId(this.usuarioId).subscribe(usuario => {      this.nombre = usuario.nombre;
      this.apellido = usuario.apellidoP;
      this.apellidoM = usuario.apellidoM;
    });
    } 
    else {
      this.usuarioId = Number(localStorage.getItem('usuarioId'));
      this.nombre = localStorage.getItem('nombre') || '';
      this.apellido = localStorage.getItem('apellidoP') || '';
      this.apellidoM = localStorage.getItem('apellidoM') || '';
    }
  
    this.obtenerDocumentos();
  }
  
  obtenerDocumentos(): void {
    
    if (this.documentosCargados) return;
    console.log('Obteniendo documentos');

    this.expedienteService.obtenerDocumentosPorUsuario(this.usuarioId).subscribe({
      next: (respuesta) => {
        // Separar la foto del resto de documentos
        const fotoDoc = respuesta.find(doc => doc.documento.toLowerCase() === 'foto');
        if (fotoDoc) {
          this.fotoUrl = `https://localhost:7064/${fotoDoc.archivo.replace(/\\/g, '/')}`;
          this.fotoId = fotoDoc.id; // Guarda el ID de la foto para actualizar si es necesario
        }
  
        // Filtra los documentos para que no se muestre el que tiene documento === 'foto'
        this.documentos = respuesta.filter(doc => doc.documento.toLowerCase() !== 'foto');
        this.documentosCargados = true;
        },
      error: (error) => {
        console.error('Error al cargar documentos:', error);
      }
    });
  }
  eliminarNuevoDocumento(index: number) {
    this.nuevosDocumentos.splice(index, 1);
  }
  agregarDocumento() {
    this.nuevosDocumentos.push({ nombre: '', archivo: null });
  }
  
  onArchivoSeleccionado(event: any, index: number) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.nuevosDocumentos[index].archivo = archivo;
    }
  }
  
  onFotoSeleccionada(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.fotoSeleccionada = archivo;
  
      // Mostrar preview
      const reader = new FileReader();
      reader.onload = e => this.fotoUrl = reader.result as string;
      reader.readAsDataURL(archivo);
    }
  }
 
  fotoCargada: boolean = false;
  
  subirDocumentos() {
    this.fotoCargada = true;
  
    let pendientes = this.nuevosDocumentos.filter(d => d.archivo);
    if (!this.fotoCargada) {
      Swal.fire('Espera', 'Estamos cargando tu información, intenta de nuevo en un momento.', 'info');
      return;
    }
    if (pendientes.length === 0 && !this.fotoSeleccionada) {
      Swal.fire('Atención', 'No hay documentos nuevos por subir', 'warning');
      return;
    }
  
    let subidos = 0;
    const totalPendientes = pendientes.length + (this.fotoSeleccionada ? 1 : 0);
  
    const verificarFinal = () => {
      subidos++;
      if (subidos === totalPendientes) {
        this.finalizarSubida();
      }
    };
  
    // Subir documentos normales
    pendientes.forEach(doc => {
      const formData = new FormData();
      formData.append('usuarioId', this.usuarioId.toString());
      formData.append('documento', doc.nombre);
      formData.append('archivo', doc.archivo);
  
      this.expedienteService.subirExpediente(formData).subscribe(() => {
        verificarFinal();
      });
    });
  
    // Subir la foto si hay una
    if (this.fotoSeleccionada) {
      const formData = new FormData();
      formData.append('usuarioId', this.usuarioId.toString());
      formData.append('documento', 'foto');
      formData.append('archivo', this.fotoSeleccionada);
  
      // ⚠️ Esperar a que fotoId esté definido correctamente
      if (this.fotoId) {
        // Actualiza foto
        this.expedienteService.actualizarDocumento(this.usuarioId, this.fotoId, formData).subscribe(() => {
          verificarFinal();
          Swal.fire('Foto actualizada', 'Tu nueva foto de perfil se ha guardado correctamente.', 'success');
        });
      } else {
        // Sube nueva foto
        this.expedienteService.subirExpediente(formData).subscribe(() => {
          verificarFinal();
          Swal.fire('Foto subida', 'Tu foto de perfil se ha subido correctamente.', 'success');
        });
      }
    }
  }
  
  getUrlDocumento(doc: any): string {
    return `https://localhost:7064/${doc.archivo.replace(/\\/g, '/')}`;
  }
  
  
  finalizarSubida() {
    Swal.fire('Éxito', 'Todos los documentos fueron subidos', 'success');
    this.nuevosDocumentos = [];
    this.fotoSeleccionada = null;
    this.editando = false;
    this.documentosCargados = true;
    this.obtenerDocumentos();
  }
  toggleEditar() {
      this.editando = true;
    }
    
  eliminarDocumento(id : number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el documento.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.expedienteService.eliminarDocumento( this.usuarioId,id).subscribe(() => {
          Swal.fire('Eliminado', 'Documento eliminado correctamente.', 'success');
          this.obtenerDocumentos();
        });
      }
    });
  }
  cancelarEdicion() {
    this.editando = false;
    this.nuevosDocumentos = []; // Limpia los documentos nuevos
  }
}
