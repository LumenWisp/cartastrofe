import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlocklyEditorComponent } from '../blockly-editor/blockly-editor.component';

// NG PRIME
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { MenuModule } from 'primeng/menu';
import { GameInfo } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';

@Component({
  selector: 'app-game',
  imports: [
    ToolbarModule,
    ButtonModule,
    TabViewModule,
    MenuModule,
    BlocklyEditorComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  game!: GameInfo;

  activeSection: string = 'cartas';

  items = [
    {
      label: 'CARTAS',
      icon: 'pi pi-clone',
      command: () => (this.activeSection = 'cartas'),
    },
    {
      label: 'CAMPO',
      icon: 'pi pi-th-large',
      command: () => (this.activeSection = 'campo'),
    },
    {
      label: 'REGRAS',
      icon: 'pi pi-cog',
      command: () => (this.activeSection = 'regras'),
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameInfoService: GameInfoService
  ) {}

  ngOnInit() {
    this.checkRouteParams();
  }

  /**
   * Verifica parâmetros da rota e carrega os dados relacionados
   */
  private async checkRouteParams() {
    const gameId = this.route.snapshot.params['gameId'];
    console.log('gameId: ', gameId);
    this.game = await this.gameInfoService.getGameInfoById(gameId);
    console.log('Jogo selecionado: ', this.game);
  }

  goBack() {
    this.router.navigate(['my-games']);
  }
}
