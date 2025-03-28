import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Categoria, CreateCategoriaDto, CategoriaService } from '../../services/categoria.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-categorias',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './tabla-categorias.component.html',
  styleUrl: './tabla-categorias.component.css'
})
export class TablaCategoriasComponent implements OnInit {


  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  categorias: Categoria[] = [];
  categoriaForm: CreateCategoriaDto = { nombre: '' };
  isEditing = false;
  editingId: number | null = null;

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias() {
    this.categoriaService.getCategorias().subscribe((data) => {
      this.categorias = data;
    });
  }

  createCategoria() {
    if (this.categoriaForm.nombre.trim() === '') return;

    if (this.isEditing && this.editingId !== null) {
      this.categoriaService.updateCategoria(this.editingId, this.categoriaForm).subscribe(() => {
        this.resetForm();
        this.loadCategorias();
      });
    } else {
      this.categoriaService.createCategoria(this.categoriaForm).subscribe(() => {
        this.resetForm();
        this.loadCategorias();
      });
    }
  }

  editCategoria(categoria: Categoria) {
    this.categoriaForm = { nombre: categoria.nombre };
    this.isEditing = true;
    this.editingId = categoria.id;
  }

  deleteCategoria(id: number) {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriaService.deleteCategoria(id).subscribe(() => {
        this.loadCategorias();
      });
    }
  }

  resetForm() {
    this.categoriaForm = { nombre: '' };
    this.isEditing = false;
    this.editingId = null;
  }

}
