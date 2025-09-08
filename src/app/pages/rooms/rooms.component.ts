import { Component, ViewChild } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UserEntity } from '../../types/user';
import { UserService } from '../../services/user-service.service';
import { TranslatePipe } from '@ngx-translate/core';
import { FreeModeService } from '../../services/free-mode.service';
import { Subscription } from 'rxjs';

import {
  CdkDrag,
  CdkDragEnd,
  CdkDragStart,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { CardModel } from '../../types/card';
import { Room, RoomState } from '../../types/room';
import { RoomService } from '../../services/room.service';
import { PlayerEntity } from '../../types/player';

import { CardGame } from '../../types/card';

import { Popover, PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-rooms',
  imports: [PanelModule, ButtonModule, DragDropModule, RouterModule, CdkDrag, PopoverModule, TranslatePipe],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css',
})
export class RoomsComponent {
  room!: Room;
  players: PlayerEntity[] = [];
  currentPlayer!: PlayerEntity;

  @ViewChild('popover') popover!: Popover;
  users: UserEntity[] = [];
  selectedCard: CardGame | null = null;

  // Subscrições
  private playerSubscription?: Subscription;
  private roomSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private router: Router,
    private userService: UserService,
    public freeModeService: FreeModeService
  ) {}

  async ngOnInit() {
    await this.checkRouteParams();
  }

  async ngOnDestroy() {
    // Verificar se o usuário não é um convidado que foi redirecionado para o login
    if (this.currentPlayer) {
      //Retirada do usuário da subcoleção após sua saída da sala
      await this.roomService.removePlayer(
        this.room.id,
        this.currentPlayer.playerID
      );

      // Verificar se o usuário que está saindo é o último na sala, para resetar ela
      if (this.players.length === 0) {
        await this.roomService.resetRoom(this.room.id);
      }

      //dessinscrição dos observables
      if (this.playerSubscription) {
        this.playerSubscription.unsubscribe();
      }
      if (this.roomSubscription) {
        this.roomSubscription.unsubscribe();
      }
    }
  }

  /**
   * Verifica parâmetros da rota e carrega os dados relacionados
   */
  private async checkRouteParams() {
    const roomLink = this.route.snapshot.params['roomLink'];
    console.log('roomLink: ', roomLink);
    if (roomLink) {
      //verificando se o usuário está logado
      const user = this.userService.getUserLogged();
      if (!user) {
        console.log('Usuário não está logado');
        this.goToLoginPage(roomLink);
        return;
      }

      const room = await this.roomService.getRoomByRoomLink(roomLink);
      if (room) {
        this.room = room;

        //Verifica se o usuário está logado e pega ele
        await this.getCurrentPlayer();

        //ouve as mudanças feitas na subcoleção de usuários
        this.playerSubscription = this.roomService
          .listenPlayers(this.room.id)
          .subscribe((players) => {
            this.players = players;
          });

        //ouve as mudanças feitas no documento da sala
        this.roomSubscription = this.roomService
          .listenRoom(this.room.id)
          .subscribe((room) => {
            this.room = room;
            if(room.state?.cards){
              this.freeModeService.cards.set(room.state.cards);
            }
            if(room.state?.piles){
              this.freeModeService.piles = room.state.piles
            }
          });
          
      }
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
    this.updateRoom()
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
    this.updateRoom()
    console.log(this.freeModeService.piles);
  }

  onDropHandle(pileId: string, coordinates: {x: number, y: number}) {
    this.isDraggingHandle = false;
    this.freeModeService.changexyOfPileCards(pileId, coordinates)
    this.updateRoom();
  }

  //pega o Jogador logado, redireciona para login se não está logado ainda
  async getCurrentPlayer() {
    const currentPlayer: PlayerEntity = await this.roomService.getCurrentPlayer(
      this.room.id
    );
    this.currentPlayer = currentPlayer;
    console.log('Jogador: ', this.currentPlayer);
  }

  private goToLoginPage(roomLink: string) {
    const queryParams: any = {
      roomLink: roomLink,
    };

    this.router.navigate(['/login'], {
      queryParams,
    });
  }

  async updateRoom(): Promise<void>{
    const newState: RoomState = {...this.room.state!, cards: this.freeModeService.cards(), piles: this.freeModeService.piles};
    this.roomService.updateRoom(this.room.id, {state: newState});
  }
}
