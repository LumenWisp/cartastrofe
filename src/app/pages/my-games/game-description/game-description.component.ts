// angular
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
// primeng
import { SplitterModule } from 'primeng/splitter';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
// services
import { GameInfoService } from '../../../services/game-info.service';
// types
import { GameInfo } from '../../../types/game-info';
// enums
import { GameModesEnum } from '../../../enum/game-modes.enum';

@Component({
  selector: 'app-game-description',
  imports: [SplitterModule, InputTextModule, CardModule, ButtonModule, RouterLink, CommonModule],
  templateUrl: './game-description.component.html',
  styleUrl: './game-description.component.css'
})
export class GameDescriptionComponent implements OnInit {
  GameModesEnum = GameModesEnum;

  gameInfo: GameInfo | null = null
  ngIconGamemode = {};

  constructor(private route: ActivatedRoute, private gameInfoService: GameInfoService) {}

  ngOnInit(): void {
    this.getGameInfoFromRoute();
  }

  async getGameInfoFromRoute() {
    const gameId = this.route.snapshot.paramMap.get('gameId');

    if (!gameId) return;

    // buscar o jogo pelo gameId
    this.gameInfo =  await this.gameInfoService.getGameInfoById(gameId)

    this.ngIconGamemode = {
      'pi-shield': this.gameInfo.gameMode === GameModesEnum.STRUCTURED,
      'pi-compass': this.gameInfo.gameMode === GameModesEnum.FREE,
    }
  }
}
