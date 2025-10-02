import { Component, computed, signal, WritableSignal } from '@angular/core';
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
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";

@Component({
  selector: 'app-game-edit-cards',
  imports: [SelectModule, ButtonModule, FormsModule, PanelModule, CardGameLayoutComponent, CommonModule, IconField, InputIcon, InputText],
  templateUrl: './game-edit-cards.component.html',
  styleUrl: './game-edit-cards.component.css'
})
export class GameEditCardsComponent {
  cardLayouts: CardLayoutModel[] = [];
  currentGame: GameInfoModel | null = null;
  search = signal('');
  layout: WritableSignal<CardLayoutModel | null> = signal(null);

  filteredAllCards = computed(() => {
    const searchValue = this.search().trim().toLowerCase();
    const selectedLayout = this.layout();
    return this.allCards().filter(({ cardModel }) => {
      const matchesSearch = !searchValue || cardModel.name.toLowerCase().includes(searchValue);
      const matchesLayout = !selectedLayout || cardModel.layoutId === selectedLayout.id;
      return matchesSearch && matchesLayout;
    });
  });

  cardsUsed: CardModel[] = [];
  allCards: WritableSignal<{ cardGame: CardGameLayout, cardModel: CardModel }[]> = signal([])

  constructor(
    private cardLayoutService: CardLayoutService,
    private gameInfoService: GameInfoService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private cardService: CardService,
  ) {
    this.loadCardLayouts();
    this.loadCurrentGame();
    this.loadCards();
  }

  loadCards() {
    this.cardService.getAllCards().then(cards => {
      this.allCards.set(cards.map(card => {
        const layout = this.cardLayouts.find(l => l.id === card.layoutId)!;
        const obj = this.convert(card, layout);
        return { cardGame: obj, cardModel: card }
      }))
    })
  }

  convert(card: CardModel, cardLayout: CardLayoutModel) {
    const obj: CardGameLayout = {
      name: cardLayout.name,
      cardFields: cardLayout.cardFields.map(field => ({
        ...field,
        value: card.data[field.property] || ''
      }))
    };

    return obj;
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
        for (const cl of cardLayouts) {
          this.cardService.getCardsByLayoutId(cl.id).then(cards => {
            for (const card of cards) {
              if (this.currentGame?.cardIds && this.currentGame.cardIds.includes(card.id)) {
                this.cardsUsed.push(card);
              }
            }
          });
        }

      });
    });
  }

  isCardOnGame(card: CardModel) {
    return this.cardsUsed.some(c => c.id === card.id)
  }

  saveLayoutsAndCards() {
    if (!this.currentGame) return;

    this.gameInfoService.updateGameInfo(
      this.currentGame.id,
      {
        cardLayoutIds: Array.from(new Set(this.cardsUsed.map(c => c.layoutId))),
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
