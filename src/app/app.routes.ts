import { Routes } from '@angular/router';

import { AuthComponent } from './layout/auth/auth.component';
import { AppMainComponent } from './layout/app-main/app-main.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MyGamesComponent } from './pages/my-games/my-games.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { MyLayoutsComponent } from './pages/my-layouts/my-layouts.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { CreateLayoutComponent } from './pages/my-layouts/create-layout/create-layout.component';
import { GameDescriptionComponent } from './pages/my-games/game-description/game-description.component';

import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppMainComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'my-games',
        component: MyGamesComponent,
        title: 'My Games',
      },
      {
        path: 'my-layouts',
        component: MyLayoutsComponent,
        title: 'My Layouts',
      },
      {
        path: 'rooms',
        component: RoomsComponent,
        title: 'Rooms',
      },
      {
        path: 'my-layouts/create-layout',
        component: CreateLayoutComponent,
        title: 'Create Layout',
      },
      {
        path: 'my-games/game-description/:gameId',
        component: GameDescriptionComponent,
        title: 'Game Description',
      },
    ],
  },
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
      },
    ],
  },
];
