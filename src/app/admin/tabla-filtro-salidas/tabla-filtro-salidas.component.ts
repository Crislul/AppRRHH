import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SalidaService } from '../../services/salida.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import localeEs from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';


export interface Salida{
  id: number;
  fecha: string;
  usuarioId: number;
  usuarioNombre: string; 
  usuarioApellidoP: string; 
  usuarioApellidoM: string; 
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

interface UsuarioConContador {
  usuarioId: number;
  nombreCompleto: string;
  cantidad: number;
}

registerLocaleData(localeEs);

@Component({
  selector: 'app-tabla-filtro-salidas',
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }
  ],
  templateUrl: './tabla-filtro-salidas.component.html',
  styleUrl: './tabla-filtro-salidas.component.css'
})

export class TablaFiltroSalidasComponent implements OnInit {

  filtroNombre: string = '';
  filtroFechaInicio!: Date;
  filtroFechaFin!: Date;
  
      dataSource = new MatTableDataSource<Salida>([]);
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;
    
      constructor(
        private salidaService: SalidaService,
        private dateAdapter: DateAdapter<Date>
        ) {}
    
      ngOnInit(): void {
        this.dateAdapter.setLocale('es-MX');
        this.getIncidencias();
      }
    
      getIncidencias(): void {
        this.salidaService.getAutorizaciones().subscribe(
          (data) => {
            this.dataSource.data = data.sort((a, b) => b.id - a.id); 
          },
          (error) => {
            console.error('Error al obtener las incidencias:', error);
          }
        );
      }

      aplicarFiltros(): void {
            const nombre = this.filtroNombre.toLowerCase();
            const fechaInicio = this.filtroFechaInicio;
            const fechaFin = this.filtroFechaFin;
          
            this.dataSource.filterPredicate = (data: Salida, filter: string) => {
              const nombreCompleto = `${data.usuarioNombre} ${data.usuarioApellidoP} ${data.usuarioApellidoM}`.toLowerCase();
              const coincideNombre = nombreCompleto.includes(nombre);
          
              let fechaIncidencia: Date;
                try {
                  const partes = data.fecha.split('/');
                  fechaIncidencia = new Date(+partes[2], +partes[1] - 1, +partes[0]); // yyyy, mm-1, dd
                } catch (e) {
                  return false;
                }
      
          
              const coincideFecha =
                (!fechaInicio || fechaIncidencia >= fechaInicio) &&
                (!fechaFin || fechaIncidencia <= fechaFin);
          
              return coincideNombre && coincideFecha;
            };
          
            this.dataSource.filter = '' + Math.random(); // trigger
            this.dataSource.filter = '' + Math.random(); // para forzar el filtro
            this.agruparPorUsuario(); // <-- aquí agrupamos
          }
      
          usuariosConIncidencias: UsuarioConContador[] = [];
      
      
          usuariosDataSource = new MatTableDataSource<UsuarioConContador>();
      
      
      agruparPorUsuario(): void {
        const incidenciasFiltradas = this.dataSource.filteredData;
      
        const agrupado = new Map<number, UsuarioConContador>();
      
        for (const incidencia of incidenciasFiltradas) {
          const id = incidencia.usuarioId;
          const nombreCompleto = `${incidencia.usuarioNombre} ${incidencia.usuarioApellidoP} ${incidencia.usuarioApellidoM}`;
      
          if (!agrupado.has(id)) {
            agrupado.set(id, { usuarioId: id, nombreCompleto, cantidad: 1 });
          } else {
            agrupado.get(id)!.cantidad++;
          }
        }
      
        this.usuariosConIncidencias = Array.from(agrupado.values());
      }  

}
