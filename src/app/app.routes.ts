import { Routes } from '@angular/router';
import { RegisterbusinessComponent } from './registerbusiness/registerbusiness.component';
import { LoginComponent } from './login/login.component';
import { BusinesssearchComponent } from './businesssearch/businesssearch.component';
import { authGuard } from './Guard/auth.guard';

export const routes: Routes = [
    {path:'login',component:LoginComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path:'Registerbusiness',component:RegisterbusinessComponent},
    {path:'Businesssearch',component:BusinesssearchComponent, canActivate:[authGuard]},
];
