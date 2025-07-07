import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ModalCreateGameComponent } from '../../components/modal-create-game/modal-create-game.component';
import { ButtonModule } from 'primeng/button';
import { GameInfoService } from '../../services/game-info.service';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { UserEntity } from '../../types/user';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-my-games',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ModalCreateGameComponent,
    ButtonModule,
    PanelModule,
    CommonModule,
  ],
  templateUrl: './my-games.component.html',
  styleUrl: './my-games.component.css',
})
export class MyGamesComponent {
  showCreateGameModal: boolean = false;

  user: UserEntity | null = null;

  @ViewChild('panels') panelsEl: ElementRef<HTMLDivElement> | undefined;

  constructor(
    private gameInfoService: GameInfoService,
    private userService: UserService
  ) {}

  ngOnInit(){
    this.user = this.userService.getUserLogged();
  }

  @HostListener('window:resize')
  remainingGameInfoSpace() {
    if (!this.panelsEl) return [];

    const style = getComputedStyle(this.panelsEl.nativeElement);
    const styleColumns = style.getPropertyValue('grid-template-columns');
    const columns = styleColumns.split(' ').length;
    const occupiedColumns = this.gameInfoService.totalGameInfos + 1;
    const remainder = occupiedColumns % columns;
    const count = remainder === 0 ? columns : columns - remainder;
    return new Array(count).fill(null);
  }

  showDialog() {
    this.showCreateGameModal = true;
  }
}
