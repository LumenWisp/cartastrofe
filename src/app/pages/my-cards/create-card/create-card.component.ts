import { Component, ViewChild, ViewChildren, ElementRef, QueryList, OnInit, Input } from '@angular/core';

import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { CardFieldTypesEnum } from '../../../enum/card-field-types.enum';

import { CardLayoutFieldModel } from '../../../types/card-layout-field';
import { CardLayoutModel } from '../../../types/card-layout';

import { CardService } from '../../../services/card.service';
import { CardLayoutService } from '../../../services/card-layout.service';
import { UserService } from '../../../services/user-service.service';
import { CardModel } from '../../../types/card';

@Component({
  selector: 'app-create-card',
  imports: [TextareaModule, ButtonModule, CommonModule],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.css'
})
export class CreateCardComponent{

  @ViewChildren('fieldRefs') fieldRefs!: QueryList<ElementRef>;
  @ViewChild('containerCard') containerCard!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private cardService: CardService,
    private userService: UserService,
    private cardLayoutService: CardLayoutService
  ) {}

  cardFields: CardLayoutFieldModel[] = [];

  layoutId!: string | null;
  layout: CardLayoutModel | null = null;
  async ngOnInit() { 
    this.layoutId = this.route.snapshot.paramMap.get('layoutId');
    if(this.layoutId){
      this.layout = await this.cardLayoutService.getCardLayoutById(this.layoutId)
    }
  }

  saveCard() {

  }

  /*addField() {
    const newField: CardFieldModel = {
      fieldId: this.generateFieldId(),
      content: '',
    };
    this.cardFields.push(newField);
  }

  removeField(fieldId: string) {
    this.cardFields = this.cardFields.filter(field => field.fieldId !== fieldId);
  }

  async saveCard() {
    const user = await this.userService.getCurrentUser();
    if (user) {
      await this.cardService.saveCard({
        userId: user.id,
        fields: this.cardFields,
      });
    }
  }

  private generateFieldId(): string {
    return 'field-' + Math.random().toString(36).substr(2, 9);
  }*/
}
