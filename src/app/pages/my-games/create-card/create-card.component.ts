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

@Component({
  selector: 'app-create-card',
  imports: [FormsModule, InputTextModule, SelectModule, FloatLabelModule, CardGameLayoutComponent, ButtonModule],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.css'
})
export class CreateCardComponent {
  cardName = '';
  cardLayout: WritableSignal<CardLayoutModel | null> = signal(null);
  cardLayouts: CardLayoutModel[] = []

  cardGame = computed(() => {
    const layout = this.cardLayout();
    return layout
      ? {
        name: layout.name,
        cardFields: layout.cardFields.map(field => ({ ...field, value: '' }))
      } as CardGameLayout
      : null;
  })

  selectedField: CardGameField | null = null;

  constructor(
    private cardLayoutService: CardLayoutService,
    private cardService: CardService,
    private toastService: ToastService,
  ) {
    this.loadCardLayouts();
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

    this.cardService.saveCard(this.cardName, this.cardGame()!, this.cardLayout()!).then(() => {
      this.toastService.showSuccessToast(
        'Criação de carta',
        'Carta criada com sucesso.'
      );
    });
  }
}
