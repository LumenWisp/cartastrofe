import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CardLayoutModel } from '../../../types/card-layout';
import { CardLayoutService } from '../../../services/card-layout.service';
import { ButtonModule } from 'primeng/button';
import { GameInfoService } from '../../../services/game-info.service';
import { ActivatedRoute } from '@angular/router';
import { GameInfoModel } from '../../../types/game-info';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-game-edit',
  imports: [TabsModule, SelectModule, FormsModule, ButtonModule],
  templateUrl: './game-edit.component.html',
  styleUrl: './game-edit.component.css'
})
export class GameEditComponent {
  cardLayout: CardLayoutModel | null = null;
  cardLayouts: CardLayoutModel[] = [];
  currentGame: GameInfoModel | null = null;

  constructor(
    private cardLayoutService: CardLayoutService,
    private gameInfoService: GameInfoService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) {
    this.loadCardLayouts();
    this.loadCurrentGame();
  }

  loadCardLayouts() {
    this.cardLayoutService.getCardLayouts().then(cardLayouts => {
      this.cardLayouts = cardLayouts;
    })
  }

  loadCurrentGame() {
    const gameId = this.route.snapshot.paramMap.get('gameId');
    if (!gameId) return;

    this.gameInfoService.getGameInfoById(gameId).then(game => {
      this.currentGame = game;
    })
  }

  saveGame() {
    if (!this.currentGame) return;

    // this.gameInfoService.updateGameInfo(
    //   this.currentGame.id,
    //   {
    //     cardLayoutId: this.cardLayout?.id
    //   }
    // ).then(() => {
    //   this.toastService.showSuccessToast(
    //     'Edição de jogo',
    //     'Jogo atualizado com sucesso.'
    //   );
    // })
  }
}
