import { Component, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-header',
  imports: [MenubarModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  @Output() openCreateRoomModal = new EventEmitter<boolean>();

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
      command: () => {
        this.openCreateRoomModal.emit(true)
      },
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.userService.logout();
        this.router.navigate(['login']);
      },
    },
  ];

  constructor(private userService: UserService, private router: Router) {}
}
