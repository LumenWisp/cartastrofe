import { Component, OnInit } from '@angular/core';
import { GameInfoModel } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlocklyEditorComponent } from '../blockly-editor/blockly-editor.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-game-rules',
  imports: [BlocklyEditorComponent, RouterLink, ButtonModule, DialogModule, PanelMenuModule],
  templateUrl: './game-rules.component.html',
  styleUrl: './game-rules.component.css'
})
export class GameRulesComponent implements OnInit {
  game!: GameInfoModel;
  visible = false;
  text = 'Escolha um tópico no menu à esquerda para ver a explicação.';

  items = [
    {
      label: 'Triggers',
      items: [
        {
          label: 'On Game Start',
          command: () => {
            this.text = '[texto explicativo sobre o gatilho On Game Start]';
          }
        },
        {
          label: 'Win Condition',
          command: () => {
            this.text = '[texto explicativo sobre a Win Condition]';
          }
        },
        {
          label: 'On Move Card From To',
          command: () => {
            this.text = '[texto explicativo sobre o gatilho On Move Card From To]';
          }
        },
        {
          label: 'On Phase Start',
          command: () => {
            this.text = '[texto explicativo sobre o gatilho On Phase Start]';
          }
        },
        {
          label: 'On Phase End',
          command: () => {
            this.text = '[texto explicativo sobre o gatilho On Phase End]';
          }
        },
      ]
    },
    {
      label: 'Variables',
      command: () => {
        this.text = '[texto explicativo sobre variável]';
      }
    },
    {
      label: 'Actions',
      command: () => {
        this.text = '[texto explicativo sobre a ação Move Card]';
      }
    },
    {
      label: 'Control',
      command: () => {
        this.text = '[texto explicativo sobre a estrutura If]';
      }
    }
  ];

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
    const game = await this.gameInfoService.getGameInfoById(gameId);
    if(game) this.game = game;
  }

  showDialog() {
    this.visible = true;
    this.text = 'Escolha um tópico no menu à esquerda para ver a explicação.';
  }
}
