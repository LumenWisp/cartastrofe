// angular
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragMove } from '@angular/cdk/drag-drop';
// types
import { CardLayoutField, CardFieldDimensions, CardGameField } from '../../types/card-layout-field';
// enum
import { CardFieldTypesEnum } from '../../enum/card-field-types.enum';
// services
import { UtilsService } from '../../services/utils.service';

type Direction = 'right' | 'left' | 'up' | 'down'

@Component({
  selector: 'app-card-game-layout-field',
  imports: [CommonModule, CdkDrag],
  templateUrl: './card-game-layout-field.component.html',
  styleUrl: './card-game-layout-field.component.css'
})
export class CardGameLayoutFieldComponent implements OnDestroy {
  @Input({ required: true }) cardLayoutField!: CardLayoutField | CardGameField;
  @Input({ required: true }) dimensions!: CardFieldDimensions
  @Input() dragBoundary = ''

  @Output() cardLayoutFieldClicked = new EventEmitter<typeof this.cardLayoutField>()

  /* relacionados ao drag */
  private isDragging = false;
  startDragPosition = { x: 0, y: 0 }

  /* relacionados ao resize */
  private resizeStartX = 0;
  private resizeStartY = 0;
  private resizeDirection: Direction | null = null
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;

  constructor(private utils: UtilsService) {}

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  hasValue(field: CardLayoutField | CardGameField): field is CardGameField {
    return 'value' in field
  }

  getIcon(type: CardFieldTypesEnum) {
    const icons = {
      [CardFieldTypesEnum.IMAGE]: 'pi-image',
      [CardFieldTypesEnum.TEXT]: 'pi-file'
    }
    return icons[type]
  }

  handleClick() {
    this.cardLayoutFieldClicked.emit(this.cardLayoutField);
  }

  get dragPosition() {
    // quando o usuário está arrastando usa o this.lastPosition para lembrar da última posição,
    // isso é feito, pois o cdkDragFreeDragPosition entrava em conflito com o cdkDragMoved quando
    // seu valor era { x: this.cardLayoutField.x, y: this.cardLayoutField.y }, acelerando o elemento
    // assim, quando o usuário arrasta somente o cdkDragMoved tem efeito, mas quando as coordenadas
    // x ou y do this.cardLayoutField são alteradas, o elemento é movido
    // dessa forma, o usuário consegue atuzalizar a posição do elemento tanto o arrastando quanto mudando
    // this.cardLayoutField.x ou this.cardLayoutField.y
    return this.isDragging ? this.startDragPosition : { x: this.cardLayoutField.x, y: this.cardLayoutField.y }
  }

  startDrag() {
    if (!this.dragBoundary) return;

    this.isDragging = true;
    this.startDragPosition = {
      x: this.cardLayoutField.x,
      y: this.cardLayoutField.y,
    }
  }

  dragging(event: CdkDragMove) {
    if (!this.dragBoundary) return;

    const { x, y } = event.source.getFreeDragPosition()

    // não permite valores quebrados ou negativos em caso de -0
    this.cardLayoutField.x = Math.ceil(x) || 0
    this.cardLayoutField.y = Math.ceil(y) || 0
  }

  endDrag() {
    if (!this.dragBoundary) return;

    this.isDragging = false;
  }

  startResize(event: MouseEvent, direction: Direction) {
    if (!this.dragBoundary) return;

    // previne que o drag ocorra
    event.stopPropagation();
    // não desconsidera o click
    this.handleClick();

    this.resizeStartX = event.clientX;
    this.resizeStartY = event.clientY;
    this.resizeDirection = direction;
    this.startWidth = this.cardLayoutField.width;
    this.startHeight = this.cardLayoutField.height;
    this.startX = this.cardLayoutField.x;
    this.startY = this.cardLayoutField.y;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (event: MouseEvent): void => {
    if (!this.dragBoundary) return;

    const deltaX = event.clientX - this.resizeStartX;
    const deltaY = event.clientY - this.resizeStartY;

    if (this.resizeDirection === 'right') {
      const newWidth = this.utils.checkRange(
        this.startWidth + deltaX,
        this.dimensions.minWidth,
        this.dimensions.maxWidth - this.cardLayoutField.x
      );
      this.cardLayoutField.width = newWidth;
    } else if (this.resizeDirection === 'left') {
      const newWidth = this.utils.checkRange(
        this.startWidth - deltaX,
        this.dimensions.minWidth,
        this.startX + this.startWidth
      );
      this.cardLayoutField.width = newWidth;
      this.cardLayoutField.x = this.utils.checkRange(
        this.startX + deltaX,
        0,
        this.startX + this.startWidth - newWidth
      );
    } else if (this.resizeDirection === 'down') {
      const newHeight = this.utils.checkRange(
        this.startHeight + deltaY,
        this.dimensions.minHeight,
        this.dimensions.maxHeight - this.cardLayoutField.y
      );
      this.cardLayoutField.height = newHeight;
    } else if (this.resizeDirection === 'up') {
      const newHeight = this.utils.checkRange(
        this.startHeight - deltaY,
        this.dimensions.minHeight,
        this.startY + this.startHeight
      );
      this.cardLayoutField.height = newHeight;
      this.cardLayoutField.y = this.utils.checkRange(
        this.startY + deltaY,
        0,
        this.startY + this.startHeight - newHeight
      );
    }
  };

  private onMouseUp = (): void => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
}
