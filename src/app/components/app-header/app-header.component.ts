// angular
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
// primeng
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
// services
import { UserService } from '../../services/user-service.service';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-app-header',
  imports: [MenubarModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  @Output() openCreateRoomModal = new EventEmitter<boolean>();

  translateService = inject(TranslateService);
  menuItems: MenuItem[] = [];

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
          label: 'Minhas Cartas',
          icon: 'pi pi-clone',
          routerLink: '/my-cards'
        },
        {
          label: translations.myLayouts,
          icon: 'pi pi-objects-column',
          routerLink: '/my-layouts',
        },
        {
          label: translations.createRoom,
          icon: 'pi pi-plus',
          command: () => {
            this.openCreateRoomModal.emit(true)
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

  constructor(private userService: UserService, private router: Router) {}
}
