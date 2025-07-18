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
import { GameInfo } from '../../types/game-info';
import { PanelGameComponent } from '../../components/panel-game/panel-game.component';

@Component({
  selector: 'app-my-games',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ModalCreateGameComponent,
    PanelGameComponent,
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
  games: GameInfo[] = []

  @ViewChild('panels') panelsEl: ElementRef<HTMLDivElement> | undefined;

  constructor(
    private gameInfoService: GameInfoService,
    private userService: UserService
  ) {}

  async ngOnInit(){
    this.user = this.userService.getUserLogged();
    await this.loadGames()
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

  async loadGames(){
    if(this.user) this.games = await this.gameInfoService.getGameInfos(this.user?.userID)
  }

  showDialog() {
    this.showCreateGameModal = true;
  }
}
