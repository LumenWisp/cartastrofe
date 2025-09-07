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
import { GameInfoModel } from '../../../types/game-info';
// enums
import { GameModesEnum } from '../../../enum/game-modes.enum';

@Component({
  selector: 'app-game-description',
  imports: [SplitterModule, InputTextModule, CardModule, ButtonModule, RouterLink, CommonModule],
  templateUrl: './game-description.component.html',
  styleUrl: './game-description.component.css'
})
export class GameDescriptionComponent implements OnInit {
  gameInfo: GameInfoModel | null = null
  ngIconGamemode = {};

  constructor(private route: ActivatedRoute, private gameInfoService: GameInfoService) {}

  ngOnInit(): void {
    this.getGameInfoFromRoute();
  }

  getGameInfoFromRoute() {
    const gameId = this.route.snapshot.paramMap.get('gameId');

    if (!gameId) return;

    // buscar o jogo pelo gameId <--------------------

    // dado mockado
    this.gameInfo = {
      id: '1',
      name: 'Game 1',
      description: 'Description for Game 1',
      countPlayersMin: 2,
      countPlayersMax: 4,
      countCards: 0,
      gameMode: GameModesEnum.STRUCTURED,
      userId: 'user1',
    }

    this.ngIconGamemode = {
      'pi-shield': this.gameInfo.gameMode === GameModesEnum.STRUCTURED,
      'pi-compass': this.gameInfo.gameMode === GameModesEnum.FREE,
    }
  }
}
