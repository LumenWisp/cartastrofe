// angular
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// primeng
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
// types
import { CardLayout } from '../../../types/card-layout';
import { CardLayoutField } from '../../../types/card-layout-field';
// enum
import { CardFieldTypesEnum } from '../../../enum/card-field-types.enum';
// services
import { CardLayoutService } from '../../../services/card-layout.service';
import { UserService } from '../../../services/user-service.service';
import { ToastService } from '../../../services/toast.service';
// components
import { CardLayoutFieldInfoComponent } from '../../../components/card-layout-field-info/card-layout-field-info.component';
import { CardGameLayoutComponent } from '../../../components/card-game-layout/card-game-layout.component';

@Component({
  selector: 'app-create-layout',
  imports: [
    MenuModule,
    TextareaModule,
    ButtonModule,
    DrawerModule,
    InputNumberModule,
    FormsModule,
    SelectModule,
    CommonModule,
    CardLayoutFieldInfoComponent,
    CardGameLayoutComponent,
  ],
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

  cardLayout: CardLayout | undefined = undefined;
  cardLayoutId: string | undefined = undefined;
  // cardFields: CardLayoutField[] = [];
  cardFieldSelected: CardLayoutField | null = null;

  MIN_CARD_FIELD_WIDTH = 40;
  MIN_CARD_FIELD_HEIGHT = 40;
  CARD_LAYOUT_WIDTH = 200;
  CARD_LAYOUT_HEIGHT = 300;

  DIMENSIONS = {
    minWidth: this.MIN_CARD_FIELD_WIDTH,
    minHeight: this.MIN_CARD_FIELD_HEIGHT,
    maxWidth: this.CARD_LAYOUT_WIDTH,
    maxHeight: this.CARD_LAYOUT_HEIGHT,
  };

  constructor(
    private cardLayoutService: CardLayoutService,
    private userService: UserService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {
    this.getCardLayoutFromRoute();
  }

  async getCardLayoutFromRoute() {
    const cardLayoutId = this.route.snapshot.paramMap.get('cardLayoutId');

    if (!cardLayoutId) return;

    this.cardLayoutService
      .getCardLayoutById(cardLayoutId)
      .then((cardLayout) => {
        if (cardLayout) {
          this.cardLayout = {
            cardFields: cardLayout.cardFields,
            name: cardLayout.name,
          };

          this.cardLayoutId = cardLayout.id;
        }
      });
  }

  addField(type: CardFieldTypesEnum) {
    if (!this.cardLayout) return;

    const newField: CardLayoutField = {
      type,
      x: 0,
      y: 0,
      width: this.MIN_CARD_FIELD_WIDTH,
      height: this.MIN_CARD_FIELD_HEIGHT,
      property: '',
    };

    this.cardLayout.cardFields.push(newField);
  }

  openCardFieldInfo(cardField: CardLayoutField) {
    this.cardFieldSelected = cardField;
  }

  closeCardFieldInfo() {
    this.cardFieldSelected = null;
  }

  saveCardLayout() {
    if (!this.cardLayout || !this.cardLayoutId) return;

    const cardLayoutProperties = this.cardLayout.cardFields.map(
      (cardField) => cardField.property
    );

    const isAnyPropertyEmpty = cardLayoutProperties.some(
      (property) => property.trim() === ''
    );
    const isPropertiesUnique =
      new Set(cardLayoutProperties).size === cardLayoutProperties.length;

    if (cardLayoutProperties.length === 0) {
      this.toastService.showErrorToast(
        'Layout de carta',
        'Sem campos adicionados!'
      );
      return;
    }

    if (isAnyPropertyEmpty) {
      this.toastService.showErrorToast(
        'Layout de carta',
        'Existem propriedades vazias!'
      );
      return;
    }

    if (!isPropertiesUnique) {
      this.toastService.showErrorToast(
        'Layout de carta',
        'Existem propriedades com o mesmo nome!'
      );
      return;
    }

    this.cardLayoutService
      .saveCardLayout(this.cardLayoutId, this.cardLayout)
      .then(() => {
        this.toastService.showSuccessToast(
          'Layout de carta',
          'Layout de carta criado com sucesso!'
        );
      });
  }
}
