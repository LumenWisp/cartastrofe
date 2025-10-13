import { Component, computed, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UserEntity } from '../../types/user';
import { TranslatePipe } from '@ngx-translate/core';
import { FreeModeService } from '../../services/free-mode.service';
import { Subscription } from 'rxjs';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnd,
  CdkDragMove,
  CdkDragStart,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { CardModel } from '../../types/card';
import { Room, RoomState } from '../../types/room';
import { RoomService } from '../../services/room.service';
import { PlayerEntity } from '../../types/player';

import { CardGame } from '../../types/card';

import { Popover, PopoverModule } from 'primeng/popover';
import { CardGameComponent } from "../../components/card-game/card-game.component";
import { CardLayoutService } from '../../services/card-layout.service';
import { GameInfoService } from '../../services/game-info.service';
import { LoadingService } from '../../services/loading.service';
import { CardGameLayout, CardLayout, CardLayoutModel } from '../../types/card-layout';
import { NgStyle } from '@angular/common';
import { RoomRolesEnum } from '../../enum/room-roles.enum';

@Component({
  selector: 'app-rooms',
  imports: [PanelModule, ButtonModule, DragDropModule, RouterModule, PopoverModule, TranslatePipe, CardGameComponent],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css',
})
export class RoomsComponent {
  room!: Room;
  players: PlayerEntity[] = [];
  currentPlayer?: PlayerEntity;

  @ViewChild('popover') popover!: Popover;
  users: UserEntity[] = [];
  selectedCard: CardGame | null = null;

  cardLayouts: { [id: string]: CardLayout } = {};

  // Subscrições
  private playerSubscription?: Subscription;
  private roomSubscription?: Subscription;

  @ViewChild('mainContent') mainContent!: ElementRef<HTMLDivElement>;
  @ViewChild('handAreaContainer') handAreaContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('handArea') handArea!: ElementRef<HTMLDivElement>;
  isOverHandArea = false;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private router: Router,
    public freeModeService: FreeModeService,
    private gameInfoService: GameInfoService,
    private loadingService: LoadingService,
  ) {}

  async ngOnInit() {
    await this.checkRouteParams();
    this.loadingService.hide();
  }

  ngAfterViewInit() {
    this.resizeHandArea();
  }

  async ngOnDestroy() {
    // Verificar se o usuário não é um convidado que foi redirecionado para o login
    if (this.currentPlayer) {
      //Retirada do usuário da subcoleção após sua saída da sala
      await this.roomService.removePlayer(
        this.room.id,
        this.currentPlayer.playerId
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

  @HostListener('window:resize')
  onResize() {
    this.resizeHandArea();
  }

  resizeHandArea() {
    const mainContentWidth = this.mainContent.nativeElement.offsetWidth;
    if (this.handAreaContainer) this.handAreaContainer.nativeElement.style.width = mainContentWidth + 'px';
  }

  onDragMoved(event: MouseEvent) {
    if (!this.isDragging) return;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const rect = this.handArea.nativeElement.getBoundingClientRect();
    this.isOverHandArea =
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom;
  }

  /**
   * Verifica parâmetros da rota e carrega os dados relacionados
   */
  private async checkRouteParams() {
    const roomLink = this.route.snapshot.params['roomLink'];
    if (roomLink) {


      const room = await this.roomService.getRoomByRoomLink(roomLink);
      if (room) {
        this.room = room;

        if (this.room.state) {
          const cardLayouts = await this.gameInfoService.getCardLayouts(this.room.state.gameId)

          for (const cardLayout of cardLayouts) {
            this.cardLayouts[cardLayout!.id] = {
              name: cardLayout!.name,
              cardFields: cardLayout!.cardFields.map(field => ({ ...field })),
            }
          }
        }

        //Verifica se o usuário está logado e pega ele
        await this.getCurrentPlayer();


        //ouve as mudanças feitas na subcoleção de usuários
        this.playerSubscription = this.roomService
          .listenPlayers(this.room.id)
          .subscribe((players) => {
            this.players = players;
          });

        // ouve as mudanças feitas no documento da sala
        this.roomSubscription = this.roomService
          .listenRoom(this.room.id)
          .subscribe(async (room) => {
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

    const cardEl = document.querySelector(`[card-id="${card.id}"] .align-popover`);

    if (this.freeModeService.isPartOfPile(card.id!)) {
      popover.show(event, cardEl);
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
    let targetElement = document.elementFromPoint(x, y); // Pegar o alvo
    draggedElement.classList.remove("remove-pointer-events"); // Remover o ignoramento kekw

    while (targetElement && !targetElement.getAttribute('card-id')) {
      targetElement = targetElement.parentElement;
    }

    const targetCardId = targetElement?.getAttribute('card-id'); // Id da carta alvo
    const draggedCardId = draggedElement.getAttribute('card-id') // Id da carta arrastada

    if (this.isDraggingHandle) {
      const draggedPileId = this.freeModeService.getPileIdFromCardId(draggedCardId!)
      this.onDropHandle(draggedPileId!, {x, y});
      return;
    }

    if ((targetElement?.classList.contains('face') || targetElement?.classList.contains('card-layout-container')) && targetCardId !== draggedCardId && targetCardId && draggedCardId) { // caso o alvo seja uma carta e não seja a própria carta arrastada
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

    if (draggedCardId) {
      if (this.isOverHandArea) {
        this.freeModeService.changeBelongsTo(draggedCardId, this.currentPlayer!.playerId);
      } else {
        if (this.freeModeService.getCardById(draggedCardId)?.belongsTo) {
          this.freeModeService.cards.update(cards =>
            cards.map(c => {
              if (c.id === draggedCardId) {
                const offsetX = 100 // 60 da escala + 40 para centralizar
                const offsetY = 150 // 90 da escala + 60 para centralizar

                return { ...c, freeDragPos: { x: event.dropPoint.x - offsetX, y: event.dropPoint.y - offsetY } }
              }

              return c
            })
          );
        }

        this.freeModeService.changeBelongsTo(draggedCardId, null);
      }

      this.resizeHandArea()
    }

    this.updateRoom()


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
  }

  private goToLoginPage(roomLink: string) {
    const queryParams: any = {
      roomLink: roomLink,
    };

    this.router.navigate(['/login'], {
      queryParams,
    });
  }

  async flipCard(card: CardGame) {
    this.freeModeService.flipCard(card.id)
    await this.updateRoom()
  }

  cardsInHand = computed(() => {
    const m : { [key: string]: number } = {}
    this.freeModeService.cards().forEach(({ belongsTo }) => m[belongsTo || 'table'] = (m[belongsTo || 'table'] || 0) + 1)
    return m
  })

  async startGame() {
    this.freeModeService.cards.set([])
    this.updateRoom();

    if (this.room.state) {
      this.loadingService.show();
      const cards = await this.gameInfoService.getCardsInGame(this.room.state.gameId);


      // const cards = await this.gameInfoService.getCards(this.room.state.gameId)
      for (const card of cards) {
        this.freeModeService.addCard({
          name: card.name,
          cardLayoutId: card.layoutId,
          data: card.data,
          freeDragPos: { x: 0, y: 0 },
          flipped: false,
          id: card.id,
          label: card.name,
          pileId: null,
          zIndex: 1,
          belongsTo: null,
        })
      }
      this.loadingService.hide();
      await this.updateRoom();
    }
  }

  isAdmin() {
    return this.currentPlayer?.role == RoomRolesEnum.ADMIN
  }

  async updateRoom(): Promise<void>{
    const newState: RoomState = {...this.room.state!, cards: this.freeModeService.cards(), piles: this.freeModeService.piles};
    this.roomService.updateRoom(this.room.id, { state: newState });
  }
}
