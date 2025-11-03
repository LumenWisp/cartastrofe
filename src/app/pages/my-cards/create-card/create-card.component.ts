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
import { CardFieldTypesEnum } from '../../../enum/card-field-types.enum';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'primeng/card';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-create-card',
  imports: [FormsModule, InputTextModule, SelectModule, FloatLabelModule, CardGameLayoutComponent, ButtonModule, TabsModule, FileUploadModule, TranslatePipe],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.css'
})
export class CreateCardComponent {
  cardName = '';
  cardId = '';
  cardLayout: WritableSignal<CardLayoutModel | null> = signal(null);
  cardModel: CardModel | undefined = undefined;
  cardLayouts: CardLayoutModel[] = []
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

  async ngOnInit() {
    await this.loadCardLayouts();
    this.getCardFromRoute();
  }

  constructor(
    private cardLayoutService: CardLayoutService,
    private cardService: CardService,
    private toastService: ToastService,
    private route: ActivatedRoute,

  ) {}

  private setEditingCardFromGameLayout(cardGameLayout: CardGameLayout, cardModel: CardModel) {
    this.editingCard = {
      name: cardGameLayout.name,
      cardFields: cardGameLayout.cardFields,
    };
    this.cardLayout.set(this.cardLayouts.find(layout => layout.id === cardModel.layoutId) ?? null);
    this.cardId = cardModel.id;
    this.cardName = cardModel.name;
  }

  async getCardFromRoute() {
    const cardId = this.route.snapshot.paramMap.get('cardId');

    if (!cardId) return;

    this.cardService
    .getCardById(cardId)
    .then((card) => {
      if (card) {
        let cardGameLayout = this.cardService.convert(card, this.cardLayouts.find(layout => layout.id === card.layoutId)!)
        this.setEditingCardFromGameLayout(cardGameLayout, card);
      }
    });
  }

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

  async loadCardLayouts() {
    this.cardLayouts = await this.cardLayoutService.getCardLayouts();
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
