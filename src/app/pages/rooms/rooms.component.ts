import { Component, ViewChild } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { UserEntity } from '../../types/user';
import { UserService } from '../../services/user-service.service';
import { TranslatePipe } from '@ngx-translate/core';
import { FreeModeService } from '../../services/free-mode.service';

import { CdkDrag, CdkDragEnd, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { CardGame } from '../../types/card';

import { Popover, PopoverModule } from 'primeng/popover';


@Component({
  selector: 'app-rooms',
  imports: [PanelModule, ButtonModule, DragDropModule, RouterModule, CdkDrag, PopoverModule, TranslatePipe],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {

  @ViewChild('popover') popover!: Popover;
  users: UserEntity[] = [];
  selectedCard: CardGame | null = null;

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
  isDraggingHandle: boolean = false;

  // Mostrar o menu de opções da carta (por enquanto, apenas embaralhar)
  showOptions(event: MouseEvent, card: CardGame, popover: Popover) {
    event.preventDefault();
    if (this.isDragging) return;
    this.selectedCard = card;
    if (this.freeModeService.isPartOfPile(card.id!)) {
      popover.show(event);
    }
  }

  // Popover de embaralhar
  onShuffleClick(pop: Popover) {
    if (this.selectedCard?.pileId) {
      this.freeModeService.shufflePile(this.selectedCard.pileId);
    }
    pop.hide(); // fecha após embaralhar
  }

  // Aumentar o zindex da carta sendo arrastada | Remover a carta da pilha em que estava (se estava)
  onDragStart(event: CdkDragStart<CardGame[]>) {
    this.isDragging = true;
    if (this.popover) {
    this.popover.hide(); // fecha o popover quando arrastar outra carta
  }

  const dragOrigin = event.event.target as HTMLElement;
  const fromHandle = dragOrigin.classList.contains('square-number-cards');

  const cardId = event.source.element.nativeElement.getAttribute('card-id');
  this.freeModeService.updateZindex(cardId!, 99999)
  const card = this.freeModeService.getCardById(cardId!)

  if (fromHandle) {
    this.isDraggingHandle = true;

  } else {
    if (card?.pileId) {
      this.freeModeService.removeCardFromPile(card?.pileId, card!);
    }
  }
  }

  // Evento disparado quando se solta uma carta sendo arrastada
  onDrop(event: CdkDragEnd<CardGame[]>) {
    setTimeout(() => this.isDragging = false, 100);

    const { x, y } = event.dropPoint; // posição do mouse no fim do drag
    const draggedElement = event.source.element.nativeElement; // Pega a carta arrastada
    draggedElement.classList.add("remove-pointer-events"); // Ignorar a carta sendo arrastada
    const targetElement = document.elementFromPoint(x, y); // Pegar o alvo
    draggedElement.classList.remove("remove-pointer-events"); // Remover o ignoramento kekw
    const targetCardId = targetElement?.getAttribute('card-id'); // Id da carta alvo
    const draggedCardId = draggedElement.getAttribute('card-id') // Id da carta arrastada

    if (this.isDraggingHandle) {
      const draggedPileId = this.freeModeService.getPileIdFromCardId(draggedCardId!)
      this.onDropHandle(draggedPileId!, {x, y});
      return;
    }

    if (targetElement?.classList.contains('face') && targetCardId !== draggedCardId && targetCardId && draggedCardId) { // caso o alvo seja uma carta e não seja a própria carta arrastada
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
      // Atualiza o X e Y da carta arrastada
      const targetCard = this.freeModeService.getCardById(targetCardId);
      const draggedCard = this.freeModeService.getCardById(draggedCardId!);
      if (targetCard && draggedCard) {
        draggedCard.freeDragPos = { ...targetCard.freeDragPos };
        this.freeModeService.updateCard(draggedCard);
      }

    }

    else {
      this.freeModeService.updateZindex(draggedCardId!, 1)

      // Caso a carta seja arrastada para um local vazio, atualizar seu x e y
      const { x, y } = event.source.getFreeDragPosition();
      const draggedCard = this.freeModeService.getCardById(draggedCardId!);
      draggedCard!.freeDragPos = { x, y };
      this.freeModeService.updateCard(draggedCard!)
    }

    console.log(this.freeModeService.piles)

  }

  onDropHandle(pileId: string, coordinates: {x: number, y: number}) {
    this.isDraggingHandle = false;
    this.freeModeService.changexyOfPileCards(pileId, coordinates)
  }

}
