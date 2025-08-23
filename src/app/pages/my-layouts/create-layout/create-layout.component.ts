// angular
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// primeng
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { Toast } from 'primeng/toast';
// enum
import { CardFieldTypesEnum } from '../../../enum/card-field-types.enum';
// types
import { CardLayoutFieldModel } from '../../../types/card-layout-field';
// services
import { CardLayoutService } from '../../../services/card-layout.service';
import { UserService } from '../../../services/user-service.service';
import { ToastService } from '../../../services/toast.service';
// components
import { CardLayoutFieldComponent } from '../../../components/card-layout-field/card-layout-field.component';
import { CardLayoutFieldInfoComponent } from '../../../components/card-layout-field-info/card-layout-field-info.component';

@Component({
  selector: 'app-create-layout',
  imports: [MenuModule, TextareaModule, ButtonModule, DrawerModule, InputNumberModule, FormsModule, SelectModule, CommonModule, CardLayoutFieldComponent, CardLayoutFieldInfoComponent, Toast],
  templateUrl: './create-layout.component.html',
  styleUrl: './create-layout.component.css',
})
export class CreateLayoutComponent {
  // configuração do menu lateral
  menuVisible = false;
  menuItems = [
    {
      label: 'Adicionar campos',
      items: [
        {
          label: 'Campo de Texto',
          icon: 'pi pi-file',
          command: () => this.addField(CardFieldTypesEnum.TEXT),
        },
        {
          label: 'Campo de Imagem',
          icon: 'pi pi-image',
          command: () => this.addField(CardFieldTypesEnum.IMAGE),
        },
      ],
    },
  ];

  cardFields: CardLayoutFieldModel[] = [];
  cardFieldSelected: CardLayoutFieldModel | null = null

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
    private userService: UserService,
    private toastService: ToastService,
  ) {}

  addField(type: CardFieldTypesEnum) {
    const newField: CardLayoutFieldModel = {
      type,
      x: 0,
      y: 0,
      width: this.MIN_CARD_FIELD_WIDTH,
      height: this.MIN_CARD_FIELD_HEIGHT,
      property: ''
    };

    this.cardFields.push(newField);
  }

  openCardFieldInfo(cardField: CardLayoutFieldModel) {
    this.cardFieldSelected = cardField;
  }

  closeCardFieldInfo() {
    this.cardFieldSelected = null;
  }

  async saveCardLayout() {
    const cardLayoutProperties = this.cardFields.map(cardField => cardField.property);

    const isAnyPropertyEmpty = cardLayoutProperties.some(property => property.trim() === '');
    const isPropertiesUnique = new Set(cardLayoutProperties).size === cardLayoutProperties.length;

    if (cardLayoutProperties.length === 0) {
      this.toastService.showErrorToast('Layout de carta', 'Sem campos adicionados!');
      return;
    }

    if (isAnyPropertyEmpty) {
      this.toastService.showErrorToast('Layout de carta', 'Existem propriedades vazias!');
      return;
    }

    if (!isPropertiesUnique) {
      this.toastService.showErrorToast('Layout de carta', 'Existem propriedades com o mesmo nome!');
      return;
    }

    this.toastService.showSuccessToast('Layout de carta', 'Layout de carta criado com sucesso!');

    this.cardLayoutService.saveCardLayout(this.cardFields)
  }
}
