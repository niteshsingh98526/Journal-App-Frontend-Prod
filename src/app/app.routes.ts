import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { JournalsComponent } from './components/journals/journals.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { adminGuard } from './guards/admin.guard';
import { AdminComponent } from './components/admin/admin.component';
import { ResetPasswordComponent } from './components/login/reset-password.component';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'about', component: AboutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent},
    { path: 'journal', component: JournalsComponent, canActivate: [authGuard] },
  
    { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },

 { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect to login by default
 { path: 'dashboard/journals', component: JournalsComponent, canActivate: [authGuard] },

 { path: 'create-admin', component: RegisterAdminComponent }
];
