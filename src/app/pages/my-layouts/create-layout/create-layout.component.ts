import { Component, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

import { MenuModule } from 'primeng/menu';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';

import { CardFieldTypesEnum } from '../../../enum/card-field-types.enum';

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

  @ViewChildren('fieldRefs') fieldRefs!: QueryList<ElementRef>;
  @ViewChild('containerRef') containerRef!: ElementRef;
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

      const updatedFields = this.cardFields.map((field, index) => {
      const element = this.fieldRefs.toArray()[index].nativeElement as HTMLElement;
      const containerRect = this.containerRef.nativeElement.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // Pega o transform considerando o deslocamente do drag and drop
      const style = window.getComputedStyle(element);
      const matrix = new WebKitCSSMatrix(style.transform);

      // Calcula X e Y baseado no translocamente do drag and drop
      const x = Math.round((elementRect.left - containerRect.left + matrix.m41) * 100) / 100;
      const y = Math.round((elementRect.top - containerRect.top + matrix.m42) * 100) / 100;

      const width = Math.round(elementRect.width * 100) / 100;
      const height = Math.round(elementRect.height * 100) / 100;

        return {
          ...field,
          x, 
          y, 
          width,
          height,
        };
      });

      const cardLayout: CardLayoutModel = {
        userId: this.userService.getUserLogged()!.userID,
        name: 'NOME DE EXEMPLO',
        cardFields: updatedFields,
      };

      await this.cardLayoutService.saveCardLayout(cardLayout);

      // Limpar a tela
      this.cardFields = [];

    } catch (error) {
      console.error('Erro no saveCardLayout: ', error);
    }
  }
}
