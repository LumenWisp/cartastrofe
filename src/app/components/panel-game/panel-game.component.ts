// angular
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// primeng
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
// enums
import { GameModesEnum } from '../../enum/game-modes.enum';
// types
import { GameInfoModel } from '../../types/game-info';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-panel-game',
  imports: [PanelModule, AvatarGroupModule, AvatarModule, CommonModule, ButtonModule, RouterLink, TranslatePipe],
  templateUrl: './panel-game.component.html',
  styleUrl: './panel-game.component.css',
})
export class PanelGameComponent implements OnInit {
  @Input({ required: true }) gameInfo!: GameInfoModel;

  ngIconGamemode = {};

  constructor() {}

  ngOnInit() {
    this.ngIconGamemode = {
      'pi-shield': this.gameInfo.gameMode === GameModesEnum.STRUCTURED,
      'pi-compass': this.gameInfo.gameMode === GameModesEnum.FREE,
    }
  }
}
