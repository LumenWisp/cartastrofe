import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardGameLayoutComponent } from '../card-game-layout/card-game-layout.component';
import { CardGameLayout, CardLayout } from '../../types/card-layout';
import { CardGame } from '../../types/card';
import { CdkDrag, CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-card-game',
  imports: [CardGameLayoutComponent, CdkDrag],
  templateUrl: './card-game.component.html',
  styleUrl: './card-game.component.css',
})
export class CardGameComponent {
  @Input({ required: true }) cardLayout!: CardLayout;
  @Input({ required: true }) card!: CardGame;
  @Input() isDisplayOnly = false;

  @Output() cardDoubleClick = new EventEmitter<MouseEvent>();
  @Output() cardContextMenu = new EventEmitter<MouseEvent>();
  @Output() cardDragStart = new EventEmitter<CdkDragStart>();
  @Output() cardDragEnd = new EventEmitter<CdkDragEnd>();
  @Output() cardDragMove = new EventEmitter<CdkDragMove>();

  get cardLayoutValues(): CardGameLayout {
    return {
      name: this.cardLayout.name,
      cardFields: this.cardLayout.cardFields.map((field) => ({
        ...field,
        value: this.card.data[field.property],
      })),
    };
  }

  onDoubleClick(event: MouseEvent) {
    this.cardDoubleClick.emit(event);
  }
  onContextMenu(event: MouseEvent) {
    this.cardContextMenu.emit(event);
  }
  onDragEnd(event: CdkDragEnd) {
    this.cardDragEnd.emit(event);
  }
  onDragMoved(event: CdkDragMove) {
    this.cardDragMove.emit(event);
  }
  onDragStart(event: CdkDragStart) {
    this.cardDragStart.emit(event);
  }
}
