import { Component, computed, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastService } from '../../../services/toast.service';
import { CardLayoutService } from '../../../services/card-layout.service';
// import { CardLayoutFieldValue } from '../../../types/card-layout-field';
import { SelectModule } from 'primeng/select';
import { CardGameLayout, CardLayoutModel } from '../../../types/card-layout';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CardGameLayoutComponent } from "../../../components/card-game-layout/card-game-layout.component";
import { CardGameField } from '../../../types/card-layout-field';
import { CardService } from '../../../services/card.service';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { CardModel } from '../../../types/card';

type CardListItem = { id: string, name: string, layout: string, card: CardGameLayout}

@Component({
  selector: 'app-create-card',
  imports: [FormsModule, InputTextModule, SelectModule, FloatLabelModule, CardGameLayoutComponent, ButtonModule, TabsModule],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.css'
})
export class CreateCardComponent {
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
  tab = '0';

  constructor(
    private cardLayoutService: CardLayoutService,
    private cardService: CardService,
    private toastService: ToastService,
  ) {
    this.loadCardLayouts();
    this.loadAllCards();
  }

  onTabChange(event: string | number) {
    event = event.toString();
    this.tab = event;
    this.editingCard = null;
    this.cardId = '';

    if (event === '0') {
      this.loadAllCards();
      this.cardName = '';
      this.cardLayout.set(null);
    }
  }

  editCard(cardObj: CardListItem) {
    this.tab = '1';
    this.editingCard = cardObj.card;

    this.cardId = cardObj.id;
    this.cardName = cardObj.name;
    this.cardLayout.set(this.cardLayouts.find(layout => layout.id === cardObj.layout)!);
  }

  deleteCard(cardObj: CardListItem) {
    this.cardService.deleteCard(cardObj.id).then(() => {
      this.toastService.showSuccessToast(
        'Deleção de carta',
        'Carta deletada com sucesso.'
      );
      this.loadAllCards();
    });
  }

  loadAllCards() {
    this.cardService.getAllCards().then(cards => {
      this.myAllCards = cards.map(card => ({
        id: card.id,
        name: card.name,
        layout: card.layoutId,
        card: this.convert(card, this.cardLayouts.find(layout => layout.id === card.layoutId)!)
      }));
    });
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
