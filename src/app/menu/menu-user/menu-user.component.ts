import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-user',
  imports: [RouterModule, CommonModule],
  templateUrl: './menu-user.component.html',
  styleUrl: './menu-user.component.css'
})
export class MenuUserComponent {

  isLeftSidebarCollapsed = input.required<boolean>();
    changeIsLeftSidebarCollapsed = output<boolean>();
  
  
    items = [
      {
        routeLink: 'index',
        icon: 'fa fa-home',
        label: 'Inicio',
      },
      {
        label: 'Incidencia',
        icon: 'fa-solid fa-person-circle-question',
        submenu: [
          { label: 'Incidencias', icon: 'fa-solid fa-list-check', routeLink: 'tabla/incidencias' },
          { label: 'Generar Incidencia', icon: 'fa-solid fa-clipboard-list', routeLink: 'generar/incidencia' }
        ],
        expanded: false
      },
      {
        label: 'Autorización de salida',
        icon: 'fa-solid fa-person-running',
        submenu: [
          { label: 'Autorizaciones de salida', icon: 'fa-solid fa-user-check', routeLink: 'tabla/salidas' },
          { label: 'Generar Autorización de salida', icon: 'fa-solid fa-user-clock', routeLink: 'generar/salida' }
        ],
        expanded: false
      },
      {
        routeLink: 'expedienteuser',
        icon: 'fa-solid fa-folder-open',
        label: 'Mi expediente',
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
