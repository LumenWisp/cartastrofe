import { Component, OnInit } from '@angular/core';
import { GameInfoService } from '../../services/game-info.service';
import { GameInfoModel } from '../../types/game-info';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlocklyEditorComponent } from '../../components/blockly-editor/blockly-editor.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-game-edit-rules',
  imports: [BlocklyEditorComponent, RouterLink, ButtonModule],
  templateUrl: './game-edit-rules.component.html',
  styleUrl: './game-edit-rules.component.css'
})
export class GameEditRulesComponent implements OnInit{
  game!: GameInfoModel;

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
    const game = await this.gameInfoService.getGameInfoById(gameId);
    if(game) this.game = game;
    console.log('Jogo selecionado: ', this.game);
  }

}
