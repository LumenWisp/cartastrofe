// angular
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
// types
import { CardGameLayout, CardLayout } from '../../types/card-layout';
// components
import { CardGameLayoutFieldComponent } from '../card-game-layout-field/card-game-layout-field.component';

@Component({
  selector: 'app-card-game-layout',
  imports: [CardGameLayoutFieldComponent, CommonModule],
  templateUrl: './card-game-layout.component.html',
  styleUrl: './card-game-layout.component.css'
})
export class CardGameLayoutComponent<T extends CardLayout | CardGameLayout> {
  @Input() cardId?: string;
  @Input() bgColor = 'transparent'
  @Input({ required: true }) cardLayout!: T;
  @Input() isEditing = false;

  @Output() cardLayoutFieldClicked = new EventEmitter<T['cardFields'][number]>()
  @Output() cardLayoutClicked = new EventEmitter<MouseEvent>()

  handleCardLayoutClicked(event: MouseEvent) {
    this.cardLayoutClicked.emit(event)
  }

  handleCardLayoutFieldClicked(cardField: T['cardFields'][number]) {
    this.cardLayoutFieldClicked.emit(cardField)
  }
}
