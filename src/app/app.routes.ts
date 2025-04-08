import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { GenerarIncidenciaAdminComponent } from './admin/generar-incidencia-admin/generar-incidencia-admin.component';
import { GenerarSalidaAdminComponent } from './admin/generar-salida-admin/generar-salida-admin.component';
import { IncidenciaAdminComponent } from './admin/incidencia-admin/incidencia-admin.component';
import { IndexAdminComponent } from './admin/index-admin/index-admin.component';
import { NotifiAdminComponent } from './admin/notifi-admin/notifi-admin.component';
import { NuevoUsuarioAdminComponent } from './admin/nuevo-usuario-admin/nuevo-usuario-admin.component';
import { SalidaAdminComponent } from './admin/salida-admin/salida-admin.component';
import { TablaExpedientesAdminComponent } from './admin/tabla-expedientes-admin/tabla-expedientes-admin.component';
import { TablaIncidenciasAdminComponent } from './admin/tabla-incidencias-admin/tabla-incidencias-admin.component';
import { TablaSalidasAdminComponent } from './admin/tabla-salidas-admin/tabla-salidas-admin.component';
import { TablaUsuariosAdminComponent } from './admin/tabla-usuarios-admin/tabla-usuarios-admin.component';
import { ExpedienteUserComponent } from './user/expediente-user/expediente-user.component';
import { GenerarIncidenciaUserComponent } from './user/generar-incidencia-user/generar-incidencia-user.component';
import { GenerarSalidaUserComponent } from './user/generar-salida-user/generar-salida-user.component';
import { IndexUserComponent } from './user/index-user/index-user.component';
import { NotifiUserComponent } from './user/notifi-user/notifi-user.component';
import { TablaIncidenciasUserComponent } from './user/tabla-incidencias-user/tabla-incidencias-user.component';
import { TablaSalidasUserComponent } from './user/tabla-salidas-user/tabla-salidas-user.component';
import { AdminHelpComponent } from './admin-help/admin-help.component';
import { authAdminGuard } from './auth-admin.guard';
import { TablaAreasComponent } from './tablas/tabla-areas/tabla-areas.component';
import { TablaCategoriasComponent } from './tablas/tabla-categorias/tabla-categorias.component';
import { TablaMotivosComponent } from './tablas/tabla-motivos/tabla-motivos.component';
import { IncidenciaUserComponent } from './user/incidencia-user/incidencia-user.component';
import { SalidaUserComponent } from './user/salida-user/salida-user.component';
import { UsuarioUserComponent } from './user/usuario-user/usuario-user.component';





export const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full'},
   { path: 'login', component: LoginComponent},
   { path: 'Help', component: AdminHelpComponent},

   // tablas 
   { path: 'tabla/Areas', component: TablaAreasComponent, canActivate: [authAdminGuard]},
   { path: 'tabla/Categorias', component: TablaCategoriasComponent, canActivate: [authAdminGuard]},
   { path: 'tabla/Motivos', component: TablaMotivosComponent, canActivate: [authAdminGuard]},
   
   
   
   // admin
   { path: 'indexAdmin', component: IndexAdminComponent, canActivate: [authAdminGuard]},

   { path: 'generarIncidenciaAdmin', component: GenerarIncidenciaAdminComponent, canActivate: [authAdminGuard]},
   { path: 'generarSalidaAdmin', component: GenerarSalidaAdminComponent, canActivate: [authAdminGuard]},
   { path: 'generarUsuario', component: NuevoUsuarioAdminComponent, canActivate: [authAdminGuard]},

   { path: 'incidencia/:id', component: IncidenciaAdminComponent, canActivate: [authAdminGuard]}, 
   { path: 'salida/:id', component: SalidaAdminComponent, canActivate: [authAdminGuard]},

   { path: 'notifiAdmin', component: NotifiAdminComponent, canActivate: [authAdminGuard]},

   { path: 'tablaExpedientesAdmin', component: TablaExpedientesAdminComponent, canActivate: [authAdminGuard]},
   { path: 'tablaIncidenciasAdmin', component: TablaIncidenciasAdminComponent, canActivate: [authAdminGuard]},
   { path: 'tablaSalidasAdmin', component: TablaSalidasAdminComponent, canActivate: [authAdminGuard]},
   { path: 'tablaUsuariosAdmin', component: TablaUsuariosAdminComponent, canActivate: [authAdminGuard]},
   

   // usuario
   { path: 'index', component: IndexUserComponent},

   { path: 'expediente', component: ExpedienteUserComponent},  

   { path: 'generar/incidencia', component: GenerarIncidenciaUserComponent}, 
   { path: 'generar/salida', component: GenerarSalidaUserComponent},
   
   { path: 'incidenciaUser/:id', component: IncidenciaUserComponent},
   { path: 'salidaUser/:id', component: SalidaUserComponent},  

   { path: 'notifi', component: NotifiUserComponent},

   { path: 'tabla/incidencias', component: TablaIncidenciasUserComponent},
   { path: 'tabla/salidas', component: TablaSalidasUserComponent},
   { path: 'configuracion', component: UsuarioUserComponent}
   
];
