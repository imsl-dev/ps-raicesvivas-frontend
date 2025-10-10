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


export const routes: Routes = [
    { path: 'sponsors', component: ListaSponsors, canActivate: [authGuard] },
    { path: 'sponsors/nuevo', component: NuevoSponsor, canActivate: [authGuard] },
    { path: 'sponsors/editar/:id', component: NuevoSponsor, canActivate: [authGuard] },
    { path: 'sponsors/ver/:id', component: NuevoSponsor, canActivate: [authGuard] },
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'eventos', component: ListadoEventos, canActivate: [authGuard] },
    { path: 'eventos/nuevo', component: NuevoEvento, canActivate: [authGuard] },
    { path: 'eventos/editar/:id', component: NuevoEvento, canActivate: [authGuard] },
    { path: 'eventos/:id', component: DetalleEvento, canActivate: [authGuard] },
    { path: '**', component: Home }
];
