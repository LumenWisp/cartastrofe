import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { GameInfo } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-edit-field',
  imports: [ButtonModule, RouterLink],
  templateUrl: './game-edit-field.component.html',
  styleUrl: './game-edit-field.component.css'
})
export class GameEditFieldComponent implements OnInit{
  game!: GameInfo;

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
