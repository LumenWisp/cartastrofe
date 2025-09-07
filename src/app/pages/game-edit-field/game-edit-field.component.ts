import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CdkDrag } from '@angular/cdk/drag-drop';

import { ButtonModule } from 'primeng/button';

import { GameInfo } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { GameFieldItems } from '../../types/game-field-items';

@Component({
  selector: 'app-game-edit-field',
  imports: [ButtonModule, RouterLink, CdkDrag],
  templateUrl: './game-edit-field.component.html',
  styleUrl: './game-edit-field.component.css'
})
export class GameEditFieldComponent implements OnInit{
  game!: GameInfo;
  items: GameFieldItems[] = [];

  addPile() {
    this.items.push({
      type: 'pile',
      position: {x: 100, y: 100},
      nameIdentifier: ''
    });
  }

  addLabel() {
    this.items.push({
      type: 'label',
      position: {x: 100, y: 100},
      nameIdentifier: ''
    });
  }


  ngOnInit() {
    this.checkRouteParams();
  }

  constructor(
    private gameInfoService: GameInfoService,
    private route: ActivatedRoute,
  ) {}

  /**
   * Verifica parâmetros da rota e carrega os dados relacionados
   */
  private async checkRouteParams() {
    const gameId = this.route.snapshot.params['gameId'];
    console.log('gameId: ', gameId);
    this.game = await this.gameInfoService.getGameInfoById(gameId);
    console.log('Jogo selecionado: ', this.game);
  }

}
