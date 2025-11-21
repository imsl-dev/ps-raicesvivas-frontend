import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { authGuard } from './guards/auth.guard';
import { ListaSponsors } from './components/pages/sponsors/lista-sponsors/lista-sponsors';
import { NuevoSponsor } from './components/pages/sponsors/nuevo-sponsor/nuevo-sponsor';
import { Login } from './components/pages/login/login';
import { Signup } from './components/pages/signup/signup';
import { DetalleEvento } from './components/pages/events/detalle-evento/detalle-evento';
import { NuevoEvento } from './components/pages/events/nuevo-evento/nuevo-evento';
import { ListadoEventos } from './components/pages/events/listado-eventos/listado-eventos';
import { adminGuard } from './guards/admin.guard';
import { organizadorGuard } from './guards/organizador.guard';
import { Profile } from './components/pages/profile/profile';
import { PagoSuccess } from './components/pages/pago/pago-success/pago-success';
import { PagoFailure } from './components/pages/pago/pago-failure/pago-failure';
import { PagoPending } from './components/pages/pago/pago-pending/pago-pending';
import { AdminPanel } from './components/pages/panels/admin-panel/admin-panel';
import { MuralDonaciones } from './components/pages/mural-donaciones/mural-donaciones';
import { PanelOrganizador } from './components/pages/panels/panel-organizador/panel-organizador';
import { PlanillaAsistencia } from './components/pages/planilla-asistencia/planilla-asistencia';


export const routes: Routes = [
    { path: 'sponsors', component: ListaSponsors, canActivate: [authGuard, adminGuard] },
    { path: 'sponsors/nuevo', component: NuevoSponsor, canActivate: [authGuard, adminGuard] },
    { path: 'sponsors/editar/:id', component: NuevoSponsor, canActivate: [authGuard, adminGuard] },
    { path: 'sponsors/ver/:id', component: NuevoSponsor, canActivate: [authGuard, adminGuard] },
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'eventos', component: ListadoEventos, canActivate: [authGuard] },
    { path: 'eventos/nuevo', component: NuevoEvento, canActivate: [authGuard, organizadorGuard] },
    { path: 'eventos/editar/:id', component: NuevoEvento, canActivate: [authGuard, organizadorGuard] },
    { path: 'eventos/:id', component: DetalleEvento, canActivate: [authGuard] },
    { path: 'perfil/:id', component: Profile, canActivate: [authGuard] },
    { path: 'pago/success', component: PagoSuccess },
    { path: 'pago/failure', component: PagoFailure },
    { path: 'pago/pending', component: PagoPending },
    { path: 'panel-administrador', component: AdminPanel, canActivate: [adminGuard] },
    { path: 'panel-organizador', component: PanelOrganizador, canActivate: [authGuard, organizadorGuard] },
    { path: 'asistencias/:id', component: PlanillaAsistencia, canActivate: [authGuard, organizadorGuard] },
    { path: 'donaciones', component: MuralDonaciones },
    { path: '**', component: Home }

];
