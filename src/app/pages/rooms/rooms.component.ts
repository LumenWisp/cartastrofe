import { Component, signal } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { UserEntity } from '../../types/user';
import { UserService } from '../../services/user-service.service';

import { CdkDrag, CdkDragEnd, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { CardModel } from '../../types/card';
import { PileModel } from '../../types/pile';


@Component({
  selector: 'app-rooms',
  imports: [PanelModule, ButtonModule, DragDropModule, RouterModule, CdkDrag ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {

  users: UserEntity[] = [];

  constructor(
    private userService: UserService
  ){}

  async ngOnInit(){
    const userCreator = this.userService.getUserLogged()
    if(userCreator){
      this.users.push(userCreator);
    }
  }

  // Criando as cartas
  cards = signal<CardModel[]>([
    { id: 'A', label: 'A', flipped: false },
    { id: 'K', label: 'K', flipped: true },
    { id: 'Q', label: 'Q', flipped: false },
  ]);

  // Criando as pilhas
  piles = signal<PileModel[]>([
    { id: 'p1', cards: this.cards() }
  ]);


  // Inverte o boolean "flipped"
  flipCard(id: string) {
    this.cards.update(cards =>
      cards.map(c => c.id === id ? { ...c, flipped: !c.flipped } : c)
    );
  }

  // Aumentar o zindex da carta sendo arrastada
  onDragStart(event: CdkDragStart<CardModel[]>) {
    event.source.element.nativeElement.classList.add("dragging");
  }

  // Evento disparado quando se solta uma carta sendo arrastada
  onDrop(event: CdkDragEnd<CardModel[]>) {
    event.source.element.nativeElement.classList.remove("dragging");
    const { x, y } = event.dropPoint; // posição do mouse no fim do drag
    event.source.element.nativeElement.classList.add("remove-pointer-events"); // Ignorar a carta sendo arrastada
    const element = document.elementFromPoint(x, y); // Pegar o alvo
    event.source.element.nativeElement.classList.remove("remove-pointer-events"); // Remover o ignoramento kekw
    const targetCardId = element?.getAttribute('card-id'); // Id da carta alvo
    const draggedCardId = event.source.element.nativeElement.getAttribute('card-id') // Id da carta arrastada

    if (element?.classList.contains('face') && targetCardId !== draggedCardId) { // caso o alvo seja uma carta e não seja a própria carta arrastada
      console.log('targetCardId = ', targetCardId);
      console.log('draggedCardId = ', draggedCardId);
    }
    
  }

}
