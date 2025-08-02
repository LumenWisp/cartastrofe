import { Component } from '@angular/core';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MenuModule } from 'primeng/menu';
import { CardFieldTypes } from '../../../enum/card-field-types.enum';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-create-layout',
  imports: [CdkDrag, CdkDropList, MenuModule, TextareaModule],
  templateUrl: './create-layout.component.html',
  styleUrl: './create-layout.component.css',
})
export class CreateLayoutComponent {
  // Configuração do menu lateral
  menuItems = [
    {
      label: 'Adicionar campos',
      items: [
        {
          label: 'Campo de Texto',
          icon: 'pi pi-file',
          command: () => this.addField(CardFieldTypes.TEXT),
        },
        {
          label: 'Campo de Imagem',
          icon: 'pi pi-image',
          command: () => this.addField(CardFieldTypes.IMAGE),
        },
      ],
    },
  ];

  // Campos da carta baseado no ENUM
  cardFields: { type: CardFieldTypes }[] = [];

  // Função para adicionar um bloco tipado no cardFields
  addField(type: CardFieldTypes.TEXT | CardFieldTypes.IMAGE) {
    this.cardFields.push({ type });
  }

  consolar() {
    console.log('consolei')
  }
}
