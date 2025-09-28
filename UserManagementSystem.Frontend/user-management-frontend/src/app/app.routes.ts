import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { InactiveComponent } from './components/inactive/inactive.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthGuard } from '../guards/authGuard';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user', component: WelcomeComponent, canActivate: [AuthGuard], data: { role: 'User' } },
  { path: 'admin', component: UsersComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'inactive', component: InactiveComponent },
  { path: '**', redirectTo: 'login' }
];
