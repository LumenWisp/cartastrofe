import { Component, computed, signal, WritableSignal } from '@angular/core';
import { CardGameField } from '../../types/card-layout-field';
import { CardGameLayout, CardLayoutModel } from '../../types/card-layout';
import { CardModel } from '../../types/card';
import { FileSelectEvent } from 'primeng/fileupload';
import { CardFieldTypesEnum } from '../../enum/card-field-types.enum';
import { CardLayoutService } from '../../services/card-layout.service';
import { CardService } from '../../services/card.service';
import { ToastService } from '../../services/toast.service';
import { CardGameLayoutComponent } from "../../components/card-game-layout/card-game-layout.component";
import { Button } from "primeng/button";
import { ActivatedRoute, Router } from '@angular/router';
import { Card3dComponent } from "../../components/card-3d/card-3d.component";

type CardListItem = { id: string, name: string, layout: string, card: CardGameLayout}

@Component({
  selector: 'app-my-cards',
  imports: [CardGameLayoutComponent, Button, Card3dComponent],
  templateUrl: './my-cards.component.html',
  styleUrl: './my-cards.component.css'
})
export class MyCardsComponent {
cardName = '';
  cardId = '';
  cardLayout: WritableSignal<CardLayoutModel | null> = signal(null);
  cardLayouts: CardLayoutModel[] = []
  myAllCards: CardListItem[] = [];
  editingCard: CardGameLayout | null = null;

  cardGame = computed(() => {
    const layout = this.cardLayout();
    return layout
      ? {
        name: layout.name,
        cardFields: this.editingCard
          ? this.editingCard?.cardFields
          : layout.cardFields.map(field => ({ ...field, value: '' }))
      } as CardGameLayout
      : null;
  })

  selectedField: CardGameField | null = null;

  ngOnInit() {
    this.loadCardLayouts();
    this.loadAllCards();
  }

  constructor(
    private cardLayoutService: CardLayoutService,
    private cardService: CardService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  isFieldImage() {
    return this.selectedField?.type === CardFieldTypesEnum.IMAGE
  }

  onSelect(event: FileSelectEvent) {
    const file = event.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (this.selectedField) {
      this.selectedField.value = base64;
      }
    };
    reader.readAsDataURL(file);
  }

  editCard(cardObj: CardListItem) {
    this.editingCard = cardObj.card;

    this.cardId = cardObj.id;
    this.cardName = cardObj.name;
    this.cardLayout.set(this.cardLayouts.find(layout => layout.id === cardObj.layout)!);
  }

  goToCreateCardPage(id: string = '') {
    this.router.navigate(['create-card', id], {
      relativeTo: this.route,
    });
  }

  deleteCard(cardObj: CardListItem) {
    this.cardService.deleteCard(cardObj.id).then(() => {
      this.toastService.showSuccessToast(
        'Deleção de carta',
        'Carta deletada com sucesso.'
      );
      this.loadAllCards();
    }).catch(() => {
      this.toastService.showErrorToast(
        'Erro ao deletar carta',
        'Não foi possível deletar a carta, porque está vinculada a um jogo. Remova-a do jogo antes de tentar novamente.'
      );
    });
  }

  loadAllCards() {
    this.cardService.getAllCards().then(cards => {
      this.myAllCards = cards.map(card => ({
        id: card.id,
        name: card.name,
        layout: card.layoutId,
        card: this.cardService.convert(card, this.cardLayouts.find(layout => layout.id === card.layoutId)!)
      }));
    });
  }

  loadCardLayouts() {
    this.cardLayoutService.getCardLayouts().then(cardLayouts => {
      this.cardLayouts = cardLayouts;
    })
  }

  clickCardField(field: CardGameField) {
    this.selectedField = field;
  }

  saveCard() {
    if (!this.cardGame()) {
      this.toastService.showErrorToast(
        'Criação de carta',
        'Nenhum layout de carta selecionado.'
      );
      return;
    }

    if (this.cardName.trim() === '') {
      this.toastService.showErrorToast(
        'Criação de carta',
        'Nenhum nome de carta fornecido.'
      );
      return;
    }

    if (this.editingCard) {
      this.cardService.updateCard(this.cardId, this.cardName, this.cardGame()!, this.cardLayout()!).then(() => {
        this.toastService.showSuccessToast(
          'Edição de carta',
          'Carta atualizada com sucesso.'
        );
      });
    } else {
      this.cardService.saveCard(this.cardName, this.cardGame()!, this.cardLayout()!).then(() => {
        this.toastService.showSuccessToast(
          'Criação de carta',
          'Carta criada com sucesso.'
        );
      });
    }
  }
}
