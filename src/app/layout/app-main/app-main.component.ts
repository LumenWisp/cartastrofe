import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ModalCreateRoomComponent } from '../../components/modal-create-room/modal-create-room.component';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-app-main',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, ModalCreateRoomComponent],
  templateUrl: './app-main.component.html',
  styleUrl: './app-main.component.css',
})
export class AppMainComponent {
  showCreateRoomDialog: boolean = false;

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
        this.showCreateRoomDialog = true;
      },
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        // FAZER LOGOUT CORRETAMENTE
        // this.userService.logoutUser();
        this.router.navigate(['login']);
      },
    },
  ];

  constructor(private router: Router, private userService: UserService) {}
}
