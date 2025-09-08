// angular
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
// primeng
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
// enums
import { GameModesEnum } from '../../enum/game-modes.enum';
// types
import { GameInfo } from '../../types/game-info';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GameInfoService } from '../../services/game-info.service';

@Component({
  selector: 'app-panel-game',
  imports: [PanelModule, AvatarGroupModule, AvatarModule, CommonModule, ButtonModule, RouterLink, TranslatePipe],
  templateUrl: './panel-game.component.html',
  styleUrl: './panel-game.component.css',
})
export class PanelGameComponent implements OnInit {
  @Output() removeGameInfo = new EventEmitter<string>();
  @Input({ required: true }) gameInfo!: GameInfo;

  ngIconGamemode = {};

  constructor(private gameInfoService: GameInfoService) {}

  ngOnInit() {
    this.ngIconGamemode = {
      'pi-shield': this.gameInfo.gameMode === GameModesEnum.STRUCTURED,
      'pi-compass': this.gameInfo.gameMode === GameModesEnum.FREE,
    }
  }

  async deleteGame(): Promise<void> {
    await this.gameInfoService.deleteGameInfo(this.gameInfo.id);
    this.removeGameInfo.emit(this.gameInfo.id);
  }
}
