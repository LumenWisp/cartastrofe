import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthComponent } from './layout/auth/auth.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
      }
    ]
  }
];
