import { Component, signal, computed } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { UserEntity } from '../../types/user';
import { UserService } from '../../services/user-service.service';
import { FreeModeService } from '../../services/free-mode.service';

import { CdkDrag, CdkDragEnd, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { CardGame } from '../../types/card';


@Component({
  selector: 'app-rooms',
  imports: [PanelModule, ButtonModule, DragDropModule, RouterModule, CdkDrag],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {

  users: UserEntity[] = [];

  constructor(
    private userService: UserService,
    public freeModeService: FreeModeService
  ){}

  async ngOnInit(){
    const userCreator = this.userService.getUserLogged()
    if(userCreator){
      this.users.push(userCreator);
    }
  }

  isDragging: boolean = false;

  // Aumentar o zindex da carta sendo arrastada | Remover a carta da pilha em que estava (se estava)
  onDragStart(event: CdkDragStart<CardGame[]>) {
    this.isDragging = true
    event.source.element.nativeElement.classList.add("dragging");
    const cardId = event.source.element.nativeElement.getAttribute('card-id');
    const card = this.freeModeService.getCardById(cardId!)
    if (card?.pileId) {
      this.freeModeService.removeCardFromPile(card?.pileId, card!);
    }
  }

  // Evento disparado quando se solta uma carta sendo arrastada
  onDrop(event: CdkDragEnd<CardGame[]>) {
    this.isDragging = false
    event.source.element.nativeElement.classList.remove("dragging");
    const { x, y } = event.dropPoint; // posição do mouse no fim do drag
    event.source.element.nativeElement.classList.add("remove-pointer-events"); // Ignorar a carta sendo arrastada
    const element = document.elementFromPoint(x, y); // Pegar o alvo
    event.source.element.nativeElement.classList.remove("remove-pointer-events"); // Remover o ignoramento kekw
    const targetCardId = element?.getAttribute('card-id'); // Id da carta alvo
    const draggedCardId = event.source.element.nativeElement.getAttribute('card-id') // Id da carta arrastada

    if (element?.classList.contains('face') && targetCardId !== draggedCardId && targetCardId && draggedCardId) { // caso o alvo seja uma carta e não seja a própria carta arrastada
      const pileTargetCardId = this.freeModeService.checkCardHasPile(targetCardId);


      // Caso a carta alvo seja parte de uma pilha, a carta arrastada fará parte dela
      if (pileTargetCardId) {

        // Adiciona a carta à pilha para onde foi arrastada
        this.freeModeService.addCardToPile(pileTargetCardId, draggedCardId)
      }

      // Caso contrário, cria-se uma pilha da carta alvo com seu id e a carta arrastada faz parte dela automaticamente
      else {

        // nova pilha com o id da carta alvo
        this.freeModeService.createPile(targetCardId)

        // Adiciona a carta alvo à sua própria pilha
        this.freeModeService.addCardToPile(targetCardId, targetCardId)

        // Adiciona a carta à pilha para onde foi arrastada
        this.freeModeService.addCardToPile(targetCardId, draggedCardId)

      }

    }

    console.log(this.freeModeService.piles)
    console.log(this.freeModeService.cards())

  }

}
