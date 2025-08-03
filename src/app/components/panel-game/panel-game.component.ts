// angular
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
// primeng
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
// enums
import { GameModes } from '../../enum/game-mode';
// types
import { GameInfo } from '../../types/game-info';

@Component({
  selector: 'app-panel-game',
  imports: [PanelModule, AvatarGroupModule, AvatarModule, CommonModule, ButtonModule, RouterLink],
  templateUrl: './panel-game.component.html',
  styleUrl: './panel-game.component.css',
})
export class PanelGameComponent implements OnInit {
  @Input({ required: true }) gameInfo!: GameInfo;

  ngIconGamemode = {};

  constructor() {}

  ngOnInit() {
    this.ngIconGamemode = {
      'pi-shield': this.gameInfo.gameMode === GameModes.STRUCTURED,
      'pi-compass': this.gameInfo.gameMode === GameModes.FREE,
    }
  }
}
