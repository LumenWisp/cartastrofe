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
  textTitle = 'Tópico'

  items = [
    {
      label: 'Triggers',
      items: [
        {
          label: 'On Game Start',
          command: () => {
            this.textTitle = 'Início do Jogo';
            this.text = 'Esse gatilho é ativado no início do jogo.';
          }
        },
        {
          label: 'Win Condition',
          command: () => {
            this.textTitle = 'Condição de Vitória';
            this.text = 'Esse gatilho é ativado quando uma condição com IF for verdadeira, encerrando o jogo.';
          }
        },
        {
          label: 'On Move Card From To',
          command: () => {
            this.textTitle = 'Ao Mover Carta De Para';
            this.text = 'Esse gatilho será ativado quando a CARTA especificada for movida para a PILHA especificada (seja por eventos de outros gatilhos, ou por movimentações manuais).';
          }
        },
        {
          label: 'On Phase Start',
          command: () => {
            this.textTitle = 'Início da Fase';
            this.text = 'Esse gatilho será ativado no início da FASE especificada.';
          }
        },
        {
          label: 'On Phase End',
          command: () => {
            this.textTitle = 'Fim da Fase';
            this.text = 'Esse gatilho executará seu código no final da FASE especificada.';
          }
        },
      ]
    },
    {
      label: 'Variables',
      command: () => {
        this.textTitle = 'Variáveis';
        this.text = 'As variáveis permitem o acesso dos atributos de jogo e das cartas no topo de pilhas. Além disso, é possível acessar os atributos das cartas no momento em que são jogadas.';
      }
    },
    {
      label: 'Actions',
      command: () => {
        this.textTitle = 'Ações';
        this.text = 'As ações permitem alterações diretas do jogo. Esses blocos devem ser usados após gatilhos pois, dessa forma, os gatilhos são responsáveis por definir quando as ações serão executadas.';
      }
    },
    {
      label: 'Control',
      command: () => {
        this.textTitle = 'Controle';
        this.text = 'Os blocos de controle permitem a comparação de valores de atributos, além de possibilitar verificações com o IF e loops com o FOR.';
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
    this.textTitle = 'Tópico'
  }
}
