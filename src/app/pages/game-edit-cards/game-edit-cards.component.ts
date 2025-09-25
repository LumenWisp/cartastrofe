import { Component } from '@angular/core';
import { CardLayoutModel } from '../../types/card-layout';
import { GameInfoModel } from '../../types/game-info';
import { CardLayoutService } from '../../services/card-layout.service';
import { GameInfoService } from '../../services/game-info.service';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-edit-cards',
  imports: [SelectModule, ButtonModule, FormsModule],
  templateUrl: './game-edit-cards.component.html',
  styleUrl: './game-edit-cards.component.css'
})
export class GameEditCardsComponent {
  cardLayoutUsed: (CardLayoutModel | null)[] = [];
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

  getUsedCardLayouts() {
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

    this.gameInfoService.getCardLayouts(gameId).then(cardLayouts => {
      this.cardLayoutUsed = cardLayouts;
      if (cardLayouts.length === 0) this.cardLayoutUsed.push(null);
    });
  }

  saveGame() {
    if (!this.currentGame) return;

    this.gameInfoService.updateGameInfo(
      this.currentGame.id,
      {
        cardLayoutIds: this.cardLayoutUsed.filter(cl => cl !== null).map(cl => cl!.id)
      }
    ).then(() => {
      this.toastService.showSuccessToast(
        'Edição de jogo',
        'Jogo atualizado com sucesso.'
      );
    })
  }
}
