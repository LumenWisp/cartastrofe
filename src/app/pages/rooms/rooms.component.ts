import { Component, signal, computed } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { UserEntity } from '../../types/user';
import { UserService } from '../../services/user-service.service';
import { Subscription } from 'rxjs';

import {
  CdkDrag,
  CdkDragEnd,
  CdkDragStart,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { CardModel } from '../../types/card';
import { Room } from '../../types/room';
import { RoomService } from '../../services/room.service';
import { PlayerEntity } from '../../types/player';

@Component({
  selector: 'app-rooms',
  imports: [PanelModule, ButtonModule, DragDropModule, RouterModule, CdkDrag],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css',
})
export class RoomsComponent {
  users: UserEntity[] = [];
  room!: Room;
  players: PlayerEntity[] = [];
  currentPlayer!: PlayerEntity;

  // Subscrições
  private playerSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  async ngOnInit() {
    const userCreator = this.userService.getUserLogged();
    if (userCreator) {
      this.users.push(userCreator);
    }

    const roomLink = this.route.snapshot.params['roomLink'];
    console.log('roomLink: ', roomLink);
    if (roomLink) {
      const room = await this.roomService.getRoomByRoomLink(roomLink);
      if (room) {
        this.room = room;
        this.currentPlayer = await this.roomService.getCurrentPlayer(
          this.room.id
        );

        console.log("Jogador: ", this.currentPlayer)

        this.playerSubscription = this.roomService
          .listenPlayers(this.room.id)
          .subscribe((players) => {
            this.players = players;
            console.log('Atualização em tempo real:', players);
          });
      }
    }
  }

  async ngOnDestroy() {
    //dessinscrição dos observables
    if (this.playerSubscription) {
      this.playerSubscription.unsubscribe();
    }

    //Retirada do usuário da subcoleção após sua saída da sala
    await this.roomService.removePlayer(
      this.room.id,
      this.currentPlayer.playerID
    );
  }

  isDragging: boolean = false;

  // Criando as cartas
  cards = signal<CardModel[]>([
    { id: 'A', label: 'A', flipped: false },
    { id: 'K', label: 'K', flipped: false },
    { id: 'Q', label: 'Q', flipped: false },
  ]);

  // Criando as pilhas
  piles: CardModel[] = [];

  // Inverte o boolean "flipped"
  flipCard(id: string) {
    if (this.isDragging) return; // ignora se foi um drag
    this.cards.update((cards) =>
      cards.map((c) => (c.id === id ? { ...c, flipped: !c.flipped } : c))
    );
  }

  // Retorna o pileId de uma carta ou undefined
  checkCardHasPile(cardId: string) {
    return this.cards().find((c) => c.id === cardId)?.pileId;
  }

  // Remove o pileId de uma carta
  removePileIdFromCard(cardId: string) {
    this.cards.update((cards) =>
      cards.map((c) => (c.id === cardId ? { ...c, pileId: '' } : c))
    );
  }

  // Aumentar o zindex da carta sendo arrastada
  onDragStart(event: CdkDragStart<CardModel[]>) {
    this.isDragging = true;
    event.source.element.nativeElement.classList.add('dragging');
    const cardId = event.source.element.nativeElement.getAttribute('card-id');
    this.removePileIdFromCard(cardId!);
  }

  // Evento disparado quando se solta uma carta sendo arrastada
  onDrop(event: CdkDragEnd<CardModel[]>) {
    this.isDragging = false;
    event.source.element.nativeElement.classList.remove('dragging');
    const { x, y } = event.dropPoint; // posição do mouse no fim do drag
    event.source.element.nativeElement.classList.add('remove-pointer-events'); // Ignorar a carta sendo arrastada
    const element = document.elementFromPoint(x, y); // Pegar o alvo
    event.source.element.nativeElement.classList.remove(
      'remove-pointer-events'
    ); // Remover o ignoramento kekw
    const targetCardId = element?.getAttribute('card-id'); // Id da carta alvo
    const draggedCardId =
      event.source.element.nativeElement.getAttribute('card-id'); // Id da carta arrastada

    if (
      element?.classList.contains('face') &&
      targetCardId !== draggedCardId &&
      targetCardId &&
      draggedCardId
    ) {
      // caso o alvo seja uma carta e não seja a própria carta arrastada
      const pileTargetCardId = this.checkCardHasPile(targetCardId);

      if (pileTargetCardId) {
        this.cards.update((cards) =>
          cards.map((c) =>
            c.id === draggedCardId ? { ...c, pileId: pileTargetCardId } : c
          )
        );
      } else {
        this.cards.update((cards) =>
          cards.map((c) =>
            c.id === targetCardId ? { ...c, pileId: targetCardId } : c
          )
        );

        this.cards.update((cards) =>
          cards.map((c) =>
            c.id === draggedCardId ? { ...c, pileId: targetCardId } : c
          )
        );
      }

      console.log(this.cards());
    }
  }
}
