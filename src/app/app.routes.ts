import { Routes } from '@angular/router';
import { RegisterbusinessComponent } from './registerbusiness/registerbusiness.component';
import { LoginComponent } from './login/login.component';
import { BusinesssearchComponent } from './businesssearch/businesssearch.component';
import { authGuard } from './Guard/auth.guard';
import { CustomerregistrationComponent } from './customerregistration/customerregistration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminComponent } from './admin/admin.component';
import { SubadminComponent } from './subadmin/subadmin.component';

export const routes: Routes = [
    {path:'login',component:LoginComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path:'Registerbusiness',component:RegisterbusinessComponent},
    {path:'Customerregistration',component:CustomerregistrationComponent},
    {path:'Businesssearch',component:BusinesssearchComponent, canActivate:[authGuard]},
    {path:'Forgot-password', component: ForgotPasswordComponent },
    {path:'Reset-password', component: ResetPasswordComponent },
    {path: 'Admin', component:AdminComponent},
    {path: 'Subadmin', component:SubadminComponent}
];
