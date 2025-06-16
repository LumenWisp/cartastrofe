import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PanelGameComponent } from '../../components/panel-game/panel-game.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ModalCreateGameComponent } from '../../components/modal-create-game/modal-create-game.component';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user-service.service';
import { GameInfo } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { PanelModule } from 'primeng/panel';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-games',
  imports: [
    PanelGameComponent,
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
  gameInfos$: Observable<GameInfo[]>;
  showCreateGameModal: boolean = false;

  @ViewChild('panels') panelsEl: ElementRef<HTMLDivElement> | undefined;

  constructor(
    private gameInfoService: GameInfoService,
  ) {
    gameInfoService.fetchGameInfos();
    this.gameInfos$ = gameInfoService.gameInfos$;
  }

  @HostListener('window:resize')
  remainingGameInfoSpace() {
    if (!this.panelsEl) return [];
    const style = getComputedStyle(this.panelsEl.nativeElement);
    const columns = style.getPropertyValue('grid-template-columns');
    const countColumns = columns.split(' ').length
    const count = (this.gameInfoService.totalGameInfos + 1) % countColumns === 0
      ? countColumns
      : countColumns - 1 - this.gameInfoService.totalGameInfos % countColumns
    return new Array(count).fill(null);
  }

  showDialog() {
    this.showCreateGameModal = true;
  }
}
