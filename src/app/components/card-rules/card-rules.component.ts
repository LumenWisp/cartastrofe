import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GameInfoModel } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { DrawerModule } from 'primeng/drawer';
import { CardGameLayout, CardLayout } from '../../types/card-layout';
import { CardGameLayoutComponent } from "../card-game-layout/card-game-layout.component";
import { Card3dComponent } from "../card-3d/card-3d.component";

type CardListItem = { id: string, layoutId: string, name: string, card: CardGameLayout}

@Component({
  selector: 'app-card-rules',
  imports: [ButtonModule, RouterLink, DrawerModule, CardGameLayoutComponent, Card3dComponent],
  templateUrl: './card-rules.component.html',
  styleUrl: './card-rules.component.css'
})
export class CardRulesComponent {
  game!: GameInfoModel;
  visible = false;
  cardLayouts: { [id: string]: CardLayout } = {};
  cards: CardListItem[] = []
  cardSelected: CardListItem | null = null

  async ngOnInit() {
    await this.checkRouteParams();
    await this.loadCards()
  }

  constructor(
    private gameInfoService: GameInfoService,
    private route: ActivatedRoute,
  ) {}

  selectCard(cardObj: CardListItem) {
    this.cardSelected = cardObj;
  }

  async loadCards() {
    const cards = await this.gameInfoService.getCardsInGame(this.game.id);
    const cardLayouts = await this.gameInfoService.getCardLayouts(this.game.id)

    for (const cardLayout of cardLayouts) {
      this.cardLayouts[cardLayout!.id] = {
        name: cardLayout!.name,
        cardFields: cardLayout!.cardFields.map(field => ({ ...field })),
      }
    }

    // Convert cards into CardGameLayout
    this.cards = cards.map(card => ({
      id: card.id,
      name: card.name,
      layoutId: card.layoutId,
      card: {
        name: card.name,
        cardFields: this.cardLayouts[card.layoutId].cardFields.map(field => {
          return {
            ...field,
            value: card.data[field.property]
          }
        })
      }
    }));
  }

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
