import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-app-main',
  imports: [RouterOutlet, MenubarModule],
  templateUrl: './app-main.component.html',
  styleUrl: './app-main.component.css'
})
export class AppMainComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Meus jogos',
      icon: 'pi pi-wrench',
      routerLink: '/my-games',
    },
    {
      label: 'Meus layouts',
      icon: 'pi pi-hashtag',
      routerLink: '/my-layouts',
    },
    {
      label: 'Criar sala',
      icon: 'pi pi-plus',
      routerLink: '/create-room',
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      routerLink: '/login',
    }
  ]
}
