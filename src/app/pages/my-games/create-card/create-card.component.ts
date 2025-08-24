import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastService } from '../../../services/toast.service';
import { CardLayoutService } from '../../../services/card-layout.service';
import { Card } from '../../../types/card';
import { CardLayoutFieldComponent } from "../../../components/card-layout-field/card-layout-field.component";
import { CardLayoutFieldValue } from '../../../types/card-layout-field';

@Component({
  selector: 'app-create-card',
  imports: [FormsModule, InputTextModule, CardLayoutFieldComponent],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.css'
})
export class CreateCardComponent implements OnInit {
  cardName = '';
  cardLayoutName = '';
  cards: Card[] = [];

  selectedField: CardLayoutFieldValue | null = null;

  MIN_CARD_FIELD_WIDTH = 40;
  MIN_CARD_FIELD_HEIGHT = 40;
  CARD_LAYOUT_WIDTH = 200;
  CARD_LAYOUT_HEIGHT = 300;

  DIMENSIONS = {
    minWidth: this.MIN_CARD_FIELD_WIDTH,
    minHeight: this.MIN_CARD_FIELD_HEIGHT,
    maxWidth: this.CARD_LAYOUT_WIDTH,
    maxHeight: this.CARD_LAYOUT_HEIGHT,
  }

  constructor(
    private cardLayoutService: CardLayoutService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cardLayoutService.fetchCardLayouts('NEkPe1V5PDccYzJFyNWSrrUKukS2').then(cardLayouts => {
      console.log(cardLayouts)
      cardLayouts.forEach(cardLayout => {
        this.cards.push({
          name: cardLayout.name,
          fields: cardLayout.cardFields.map(cardField => ({
            ...cardField,
            value: ''
          })),
        })
      })
    })
  }

  getCard() {
    return this.cards.find(card => card.name === this.cardLayoutName) ?? null
  }

  clickCard(field: CardLayoutFieldValue) {
    this.selectedField = field;
  }
}
