// ANGULAR
import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDrag,CdkDragEnd, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Popover, PopoverModule } from 'primeng/popover';

// SERVICES
import { GameInfoService } from '../../services/game-info.service';
import { RoomService } from '../../services/room.service';
import { UserService } from '../../services/user-service.service';
import { FreeModeService } from '../../services/free-mode.service';

// PRIME NG
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

// TYPES
import { GameFieldItem } from '../../types/game-field-item';
import { GameInfoModel } from '../../types/game-info';
import { PlayerEntity } from '../../types/player';
import { Room, RoomState } from '../../types/room';
import { CardLayout } from '../../types/card-layout';
import { CardGame } from '../../types/card';

// NGX TRANSLATE
import { TranslatePipe } from '@ngx-translate/core';

// RXJS
import { Subscription } from 'rxjs';
import { BlockCodeGeneratorsService } from '../../services/block-code-generators.service';

// ENUM
import { GameFieldItemEnum } from '../../enum/game-field-item.enum';
import { ToastService } from '../../services/toast.service';

// COMPONENTS
import { CardGameComponent } from "../../components/card-game/card-game.component";


@Component({
  selector: 'app-rule-based-room',
  imports: [CommonModule, PanelModule, ButtonModule,CdkDrag, DragDropModule, TranslatePipe, RouterLink, CardGameComponent, PopoverModule],
  templateUrl: './rule-based-room.component.html',
  styleUrl: './rule-based-room.component.css'
})
export class RuleBasedRoomComponent implements OnInit{

  @ViewChild('popover') popover!: Popover;

  cardLayouts: { [id: string]: CardLayout } = {};

  room!: Room;
  game!: GameInfoModel;
  items: GameFieldItem[] = [];
  players: PlayerEntity[] = [];
  currentPlayer!: PlayerEntity;

  // Subscrições
    private playerSubscription?: Subscription;
    private roomSubscription?: Subscription;

  // Caracteristicas do jogo
  phases: string[] = []; // dados mockados
  currentPhaseNumber = 0;
  currentPlayerToPlayNumber = 0;
  currentPlayerToPlay!: PlayerEntity;

  winConditionCode: string = '';

  //pilha de códigos para rodar com base em triggers
  onPhaseStartCodeList: string[] = [];
  onPhaseEndCodeList: string[] = [];

  //movimentaão das cartas
  isDragging: boolean = false;
  isDraggingHandle: boolean = false;
  selectedCard: CardGame | null = null;

  constructor(
      private gameInfoService: GameInfoService,
      private route: ActivatedRoute,
      private roomService: RoomService,
      private userService: UserService,
      private router: Router,
      private blockCodeGeneratorsService: BlockCodeGeneratorsService,
      private toastService: ToastService,
      public freeModeService: FreeModeService,
    ) {}

  ngOnInit() {
      this.checkQueryParamsGame();
      this.checkRouteParamsRoom();
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

  /**
   * Verifica parâmetros da rota e carrega os dados relacionados
   */
  private async checkQueryParamsGame() {
    const gameId = this.route.snapshot.queryParams['gameId'];
    const game = await this.gameInfoService.getGameInfoById(gameId);

    if(game) this.game = game

    if (this.game.fieldItems && this.game.fieldItems.length > 0) {
      this.items = [...this.game.fieldItems];
    }
    
    else {
      this.items.push({type: GameFieldItemEnum.PASSPHASE, position: {x: 0, y: 0}, nameIdentifier: 'passPhase'}, {type: GameFieldItemEnum.HAND, position: {x: 0, y: 0}, nameIdentifier: 'hand'});
    }
  }


  private async checkRouteParamsRoom() {
    const roomLink = this.route.snapshot.params['roomLink'];
    console.log('roomLink: ', roomLink);
    if (roomLink) {
      //verificando se o usuário está logado
      const user = await this.userService.currentUser();
      if (!user) {
        console.log('Usuário não está logado');
        this.goToLoginPage(roomLink);
        return;
      }

      const room = await this.roomService.getRoomByRoomLink(roomLink);
      if (room) {
        this.room = room;

        if (this.room.state) {
          const cards = await this.gameInfoService.getCardsInGame(this.room.state.gameId);
          const cardLayouts = await this.gameInfoService.getCardLayouts(this.room.state.gameId)

          for (const cardLayout of cardLayouts) {
            this.cardLayouts[cardLayout!.id] = {
              name: cardLayout!.name,
              cardFields: cardLayout!.cardFields.map(field => ({ ...field })),
            }
          }

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
            })
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

        //ouve as mudanças feitas no documento dessa sala
        this.roomSubscription = this.roomService
          .listenRoom(this.room.id)
          .subscribe((room) => {
            
            if((this.room.state?.isGameOcurring != room.state?.isGameOcurring) && room.state?.isGameOcurring === false){
              this.toastService.showSuccessToast('', 'Fim de jogo');
            }
            this.room = room;
          });


        // Carregar o campo do jogo
        const gameId = room.state?.gameId;
        if (gameId) {
          const game = await this.gameInfoService.getGameInfoById(gameId);
          if(game) {
            this.game = game;
            this.winConditionCode = this.game.winConditionCode!;
            if(this.game.gamePhases){
              this.phases = this.game.gamePhases;
            }
            else{
              this.phases = ['fase 1', 'fase 2', 'fase 3']
            }
          }

          if (this.game.fieldItems && this.game.fieldItems.length > 0) {
            this.items = [...this.game.fieldItems];
          }
          
          else {
            this.items.push({type: GameFieldItemEnum.PASSPHASE, position: {x: 0, y: 0}, nameIdentifier: 'passPhase'});
          }
        }
          
      }
    }
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

  private runStringCode(stringCode: string) {
    const func = new Function('blockCodeGeneratorsService', 'room', 'roomService', 'game', stringCode);

    func(this.blockCodeGeneratorsService, this.room, this.roomService, this.game);
  }

  async startGame(){
    // Atualizando a sala para que seja visivel que o jogo já começou
    if(this.room.state) this.room.state['isGameOcurring'] = true;
    this.roomService.updateRoom(this.room.id, {state: {...this.room.state!, isGameOcurring: true}});

    //Começando o jogo
    this.playGame();
  }

  async playGame(){

    const playersOrderToPlay = this.players;
    this.currentPlayerToPlay = playersOrderToPlay[this.currentPlayerToPlayNumber];

    //Verificar se o jogo possui uma trigger de ativação de inicio de jogo
    if(this.game.onGameStartCode){
      this.runStringCode(this.game.onGameStartCode)
      //this.runStringCode("console.log('SKIBIDI ONICHAN');")
    }
  }

  nextPhase(){
    this.currentPhaseNumber++;
    if(this.currentPhaseNumber < this.phases.length){
    }
    else{
      this.currentPhaseNumber = 0;
    }
    console.log("Fase Atual: ", this.phases[this.currentPhaseNumber]);
    this.toastService.showSuccessToast('Mudamos de fase', `Fase atual: ${this.phases[this.currentPhaseNumber]}`)
    this.roomService.updateRoom(this.room.id, {state: {...this.room.state!, currentphase: this.phases[this.currentPhaseNumber]}});
  }

  endGame(){
    this.roomService.updateRoom(this.room.id, {state: {...this.room.state!, isGameOcurring: false}});
  }

  async updateRoom(): Promise<void>{
      const newState: RoomState = {...this.room.state!, cards: this.freeModeService.cards(), piles: this.freeModeService.piles};
      this.roomService.updateRoom(this.room.id, { state: newState });
    }

  // =================================
  // ==== MOVIMENTAÇÃO DAS CARTAS ====
  // =================================

  // Mostrar o menu de opções da carta (por enquanto, apenas embaralhar)
  showOptions(event: MouseEvent, card: CardGame, popover: Popover) {
      event.preventDefault();
      if (this.isDragging) return;
      this.selectedCard = card;
      if (this.freeModeService.isPartOfPile(card.id!)) {
        popover.show(event);
      }
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

  onDropHandle(pileId: string, coordinates: {x: number, y: number}) {
    this.isDraggingHandle = false;
    this.freeModeService.changexyOfPileCards(pileId, coordinates)
    this.updateRoom();
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
    this.updateRoom()
    console.log(this.freeModeService.piles);
  }

}
