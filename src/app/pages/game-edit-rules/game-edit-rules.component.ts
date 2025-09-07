import { Component, OnInit } from '@angular/core';
import { GameInfoService } from '../../services/game-info.service';
import { GameInfo } from '../../types/game-info';
import { ActivatedRoute } from '@angular/router';
import { BlocklyEditorComponent } from '../../components/blockly-editor/blockly-editor.component';

@Component({
  selector: 'app-game-edit-rules',
  imports: [BlocklyEditorComponent],
  templateUrl: './game-edit-rules.component.html',
  styleUrl: './game-edit-rules.component.css'
})
export class GameEditRulesComponent implements OnInit{
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
