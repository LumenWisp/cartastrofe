import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ModalCreateRoomComponent } from '../../components/modal-create-room/modal-create-room.component';
import { UserService } from '../../services/user-service.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-app-main',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, ModalCreateRoomComponent],
  templateUrl: './app-main.component.html',
  styleUrl: './app-main.component.css',
})
export class AppMainComponent {
  showCreateRoomDialog = false;
  menuItems: MenuItem[] = [];

  translateService = inject(TranslateService);

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    forkJoin({
      myGames: this.translateService.get('app-main.menu-items.my-games'),
      myLayouts: this.translateService.get('app-main.menu-items.my-layouts'),
      createRoom: this.translateService.get('app-main.menu-items.create-room'),
      logout: this.translateService.get('app-main.menu-items.logout'),
    }).subscribe(translations => {
      this.menuItems = [
        {
          label: translations.myGames,
          icon: 'pi pi-wrench',
          routerLink: '/my-games',
        },
        {
          label: translations.myLayouts,
          icon: 'pi pi-hashtag',
          routerLink: '/my-layouts',
        },
        {
          label: translations.createRoom,
          icon: 'pi pi-plus',
          command: () => {
            this.showCreateRoomDialog = true;
          },
        },
        {
          label: translations.logout,
          icon: 'pi pi-sign-out',
          command: () => {
            this.userService.logout();
            this.router.navigate(['login']);
          },
        },
      ];
    });
  }
}
