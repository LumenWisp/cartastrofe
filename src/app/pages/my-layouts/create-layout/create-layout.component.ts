import { Component } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

import { MenuModule } from 'primeng/menu';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';

import { CardFieldTypesEnum } from '../../../enum/card-field-types.enum';
import { FirestoreTablesEnum } from '../../../enum/firestore-tables.enum';

import { CardLayoutFieldModel } from '../../../types/card-layout-field';
import { CardLayoutModel } from '../../../types/card-layout';

import { CardLayoutService } from '../../../services/card-layout.service';
import { UserService } from '../../../services/user-service.service';

@Component({
  selector: 'app-create-layout',
  imports: [CdkDrag, MenuModule, TextareaModule, ButtonModule],
  templateUrl: './create-layout.component.html',
  styleUrl: './create-layout.component.css',
})
export class CreateLayoutComponent {
  constructor(
    private cardLayoutService: CardLayoutService,
    private userService: UserService
  ) {}

  // Configuração do menu lateral
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

  addField(type: CardFieldTypesEnum.TEXT | CardFieldTypesEnum.IMAGE) {
    const newField: CardLayoutFieldModel = {
      type,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    this.cardFields.push(newField);
  }

  async saveCardLayout() {
    try {
      const cardLayout: CardLayoutModel = {
        userId: this.userService.getUserLogged()!.userID,
        name: 'NOME DE EXEMPLO',
        cardFields: this.cardFields,
      };

      await this.cardLayoutService.saveCardLayout(cardLayout);
    } catch (error) {
      console.error('Erro no saveCardLayout: ', error);
    }
  }
}
