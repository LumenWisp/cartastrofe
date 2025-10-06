import { Component } from '@angular/core';
import { CardGameLayout, CardLayoutModel } from '../../types/card-layout';
import { GameInfoModel } from '../../types/game-info';
import { CardLayoutService } from '../../services/card-layout.service';
import { GameInfoService } from '../../services/game-info.service';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { CardModel } from '../../types/card';
import { CardService } from '../../services/card.service';
import { CardGameLayoutComponent } from "../../components/card-game-layout/card-game-layout.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-edit-cards',
  imports: [SelectModule, ButtonModule, FormsModule, PanelModule, CardGameLayoutComponent, CommonModule],
  templateUrl: './game-edit-cards.component.html',
  styleUrl: './game-edit-cards.component.css'
})
export class GameEditCardsComponent {
  cardLayoutUsed: (CardLayoutModel | null)[] = [];
  cardLayouts: CardLayoutModel[] = [];
  cards: { [key: string]: CardModel[] } = {};
  cardsUsed: CardModel[] = [];
  currentGame: GameInfoModel | null = null;

  constructor(
    private cardLayoutService: CardLayoutService,
    private gameInfoService: GameInfoService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    public cardService: CardService,
  ) {
    this.loadCardLayouts();
    this.loadCurrentGame();
  }

  loadCardsForLayout(cardLayout: CardLayoutModel | null) {
    if (!cardLayout) return;
    this.fetchCards(cardLayout.id);
  }

  handleCardLayoutClicked(card: CardModel) {
    const index = this.cardsUsed.findIndex(c => c.id === card.id)

    if (index === -1) {
      this.cardsUsed.push(card);
    } else {
      this.cardsUsed.splice(index, 1);
    }
  }

  loadCardLayouts() {
    this.cardLayoutService.getCardLayouts().then(cardLayouts => {
      this.cardLayouts = cardLayouts;
    });
  }

  loadCurrentGame() {
    const gameId = this.route.snapshot.paramMap.get('gameId');
    if (!gameId) return;

    this.gameInfoService.getGameInfoById(gameId).then(game => {
      this.currentGame = game;

      this.gameInfoService.getCardLayouts(gameId).then(cardLayouts => {
        this.cardLayoutUsed = cardLayouts;
        if (cardLayouts.length === 0) this.cardLayoutUsed.push(null);

        for (const cl of cardLayouts) {
          if (!cl) continue;
          this.fetchCards(cl.id);
        }
      });

    });
  }

  fetchCards(layoutId: string) {
    if (this.cards[layoutId]) return;

    this.cardService.getCardsByLayoutId(layoutId).then(cards => {
      this.cards[layoutId] = cards;

      for (const card of cards) {
        if (this.currentGame?.cardIds && this.currentGame.cardIds.includes(card.id)) {
          this.cardsUsed.push(card);
        }
      }
    });
  }

  saveLayoutsAndCards() {
    if (!this.currentGame) return;

    this.gameInfoService.updateGameInfo(
      this.currentGame.id,
      {
        cardLayoutIds: this.cardLayoutUsed.filter(cl => cl !== null).map(cl => cl!.id),
        cardIds: this.cardsUsed.map(c => c.id),
      }
    ).then(() => {
      this.toastService.showSuccessToast(
        'Edição de jogo',
        'Jogo atualizado com sucesso.'
      );
    })
  }
}
