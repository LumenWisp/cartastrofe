// angular
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// primeng
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
// enum
import { CardFieldTypesEnum } from '../../enum/card-field-types.enum';
// types
import { CardLayoutFieldDimensions, CardLayoutFieldModel } from '../../types/card-layout-field';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-card-layout-field-info',
  imports: [InputNumberModule, FormsModule, SelectModule, CommonModule, ButtonModule, InputTextModule],
  templateUrl: './card-layout-field-info.component.html',
  styleUrl: './card-layout-field-info.component.css'
})
export class CardLayoutFieldInfoComponent {
  @Input({ required: true }) cardLayoutField!: CardLayoutFieldModel;
  @Input({ required: true }) cardLayoutDimensions!: CardLayoutFieldDimensions;

  @Output() cardLayoutFieldInfoClosed = new EventEmitter<void>();

  optionsCardType = Object.values(CardFieldTypesEnum).map(value => ({ label: value, value }));

  constructor(private utils: UtilsService) {}

  infoClosed() {
    this.cardLayoutFieldInfoClosed.emit();
  }

  checkX() {
    this.cardLayoutField.x = this.utils.checkRange(
      this.cardLayoutField.x,
      0,
      this.cardLayoutDimensions.maxWidth - this.cardLayoutField.width
    );
  }

  checkY() {
    this.cardLayoutField.y = this.utils.checkRange(
      this.cardLayoutField.y,
      0,
      this.cardLayoutDimensions.maxHeight - this.cardLayoutField.height
    );
  }

  checkWidth() {
    this.cardLayoutField.width = this.utils.checkRange(
      this.cardLayoutField.width,
      this.cardLayoutDimensions.minWidth,
      this.cardLayoutDimensions.maxWidth
    );

    this.cardLayoutField.x = this.adjustWhenOverflow(
      this.cardLayoutField.x,
      this.cardLayoutField.width,
      this.cardLayoutDimensions.maxWidth
    );
  }

  checkHeight() {
    this.cardLayoutField.height = this.utils.checkRange(
      this.cardLayoutField.height,
      this.cardLayoutDimensions.minHeight,
      this.cardLayoutDimensions.maxHeight
    );

    this.cardLayoutField.y = this.adjustWhenOverflow(
      this.cardLayoutField.y,
      this.cardLayoutField.height,
      this.cardLayoutDimensions.maxHeight
    );
  }

  /**
   * Ajusta a posição para que um elemento não ultrapasse o limite máximo.
   * @param pos - A posição inicial (eixo X ou Y).
   * @param length - O tamanho (largura ou altura).
   * @param maxLength - O tamanho máximo.
   * @returns A posição ajustada para que `pos + length <= maxLength`.
   */
  private adjustWhenOverflow(pos: number, length: number, maxLength: number) {
    const overflow = pos + length - maxLength;
    return overflow > 0 ? pos - overflow : pos;
  }
}
