import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {


  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();


  items = [
    {
      routeLink: 'indexAdmin',
      icon: 'fa fa-home',
      label: 'Inicio',
    },
    {
      label: 'Incidencia del personal',
      icon: 'fa-solid fa-person-circle-question',
      submenu: [
        { label: 'Incidencias', icon: 'fa-solid fa-list-check', routeLink: 'tablaIncidenciasAdmin' },
        { label: 'Generar Incidencia', icon: 'fa-solid fa-clipboard-list', routeLink: 'generarIncidenciaAdmin' }
      ],
      expanded: false
    },
    {
      label: 'Autorización de salida del personal',
      icon: 'fa-solid fa-person-running',
      submenu: [
        { label: 'Autorización de salida', icon: 'fa-solid fa-user-check', routeLink: 'tablaSalidasAdmin' },
        { label: 'Generar Autorización de salida', icon: 'fa-solid fa-user-clock', routeLink: 'generarSalidaAdmin' }
      ],
      expanded: false
    },
    {
      routeLink: 'tablaExpedientesAdmin',
      icon: 'fa-solid fa-folder-open',
      label: 'Expedientes',
    },
    {
      label: 'Gestión de usuarios',
      icon: 'fa-solid fa-user',
      submenu: [
        { label: 'Usuarios', icon: 'fa fa-users', routeLink: 'tablaUsuariosAdmin' },
        { label: 'Crear nuevo usuario', icon: 'fa-solid fa-user-plus', routeLink: 'generarUsuario' }
      ],
      expanded: false
    },
    {
      label: 'Extra',
      icon: 'fa-solid fa-house-user',
      submenu: [
        { label: 'Áreas', icon: 'fa-solid fa-chalkboard-user', routeLink: 'tabla/Areas' },
        { label: 'Categorías', icon: 'fa-solid fa-shapes', routeLink: 'tabla/Categorias' },
        { label: 'Motivos / Autorización', icon: 'fa-solid fa-person-falling', routeLink: 'tabla/Motivos' }
      ],
      expanded: false
    }
  ];

  

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());

    if (this.isLeftSidebarCollapsed()) {
      this.items.forEach((item) => {
        if (item.submenu) {
          item.expanded = false; // Contraer el submenú
        }
      });
    }
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  toggleSubmenu(index: number) {
    this.items[index].expanded = !this.items[index].expanded;
  }

  handleClick(event: Event, item: any, index: number) {
    if (this.isLeftSidebarCollapsed()) {
      if (item.submenu) {
        event.preventDefault(); // Evita la redirección
        this.toggleCollapse(); // Expande el menú lateral
        this.toggleSubmenu(index); // Despliega el submenú
      }
      // Si no es un submenú, el enlace redirigirá normalmente
    } else {
      // Si el menú no está colapsado, maneja el submenú como antes
      if (item.submenu) {
        event.preventDefault(); // Evita la redirección
        this.toggleSubmenu(index); // Despliega el submenú
      }
    }
  }
}


