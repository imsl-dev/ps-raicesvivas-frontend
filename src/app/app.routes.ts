import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { authGuard } from './guards/auth.guard';
import { ListaSponsors } from './components/pages/sponsors/lista-sponsors/lista-sponsors';
import { NuevoSponsor } from './components/pages/sponsors/nuevo-sponsor/nuevo-sponsor';
import { Login } from './components/pages/login/login';


export const routes: Routes = [
    { path: 'sponsors', component: ListaSponsors, canActivate: [authGuard] },
    { path: 'nuevo-sponsor', component: NuevoSponsor, canActivate: [authGuard] },
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: '**', component: Home }
];
