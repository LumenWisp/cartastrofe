import { Routes } from '@angular/router';
// layouts
import { AuthComponent } from './layout/auth/auth.component';
import { AppMainComponent } from './layout/app-main/app-main.component';
// pages
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MyGamesComponent } from './pages/my-games/my-games.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { MyLayoutsComponent } from './pages/my-layouts/my-layouts.component';

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
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
        title: 'Esqueci a Senha',
      },
      {
        path: 'reset-password/:token',
        component: ResetPasswordComponent,
        title: 'Redefinir Senha',
      }
    ]
  },
  {
    path: '',
    component: AppMainComponent,
    children: [
      {
        path: 'my-games',
        component: MyGamesComponent,
      },
      {
        path: 'my-layouts',
        component: MyLayoutsComponent,
      },
    ]
  }
];
