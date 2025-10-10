// ANGULAR
import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { CdkDrag,CdkDragEnd, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Popover, PopoverModule } from 'primeng/popover';

// SERVICES
import { GameInfoService } from '../../services/game-info.service';
import { RoomService } from '../../services/room.service';
import { UserService } from '../../services/user-service.service';
import { FreeModeService } from '../../services/free-mode.service';
import { LoadingService } from '../../services/loading.service';

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
  @ViewChild('gameField') gameField!: ElementRef<HTMLDivElement>;

  cardLayouts: { [id: string]: CardLayout } = {};

  room!: Room;
  game!: GameInfoModel;
  items: GameFieldItem[] = [];
  players: PlayerEntity[] = [];
  currentPlayer!: PlayerEntity;

  // Subscrições
    private playerSubscription?: Subscription;
    private roomSubscription?: Subscription;
    private cardSubscription?: Subscription;

  @ViewChild('mainContent') mainContent!: ElementRef<HTMLDivElement>;
  @ViewChild('handAreaContainer') handAreaContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('handArea') handArea!: ElementRef<HTMLDivElement>;
  isOverHandArea = false;

  // Caracteristicas do jogo
  phases: string[] = [];
  totalPhases: number = 0;
  currentPhaseNumber = 0;
  currentPlayerToPlayNumber = 0;
  currentPlayerToPlay!: PlayerEntity;
  isGameOcurringHTML: boolean = false;
  isDragDisabled: boolean = true;

  winConditionCode: string = '';

  //pilha de códigos para rodar com base em triggers
  onPhaseStartCodeList!: TriggersList;
  onPhaseEndCodeList!: TriggersList;

  //movimentaão das cartas
  isDragging: string = "";
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
      private loadingService: LoadingService,
    ) {}

  ngOnInit() {
      this.checkQueryParamsGame();
      this.checkRouteParamsRoom();
      this.loadingService.hide(); // precaucao
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
      if (this.cardSubscription) {
        this.cardSubscription.unsubscribe();
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
    if (this.isDragging == null) return;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const rect = this.handArea.nativeElement.getBoundingClientRect();
    this.isOverHandArea =
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom;
  }

  //Verifica parâmetros da rota e carrega os dados relacionados
  private async checkQueryParamsGame() {
    const gameId = this.route.snapshot.queryParams['gameId'];
    const game = await this.gameInfoService.getGameInfoById(gameId);

    if(game) this.game = game

    if (this.game && this.game.fieldItems && this.game.fieldItems.length > 0) {
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
          const cardLayouts = await this.gameInfoService.getCardLayouts(this.room.state.gameId);
          
          const ruledPiles = await this.gameInfoService.getRuledPiles(this.room.state.gameId);
          ruledPiles[0].cardIds = cards.map(c => c.id);
          const firstRuledPileId = ruledPiles[0].nameIdentifier;
          const cardStringCodes = cards as any // Deixa essa macacada, depois tem que ajeitar a tipagem no card.ts

          for (const ruledPile of ruledPiles) {
            this.freeModeService.addRuledPile(ruledPile);
          }

          for (const cardLayout of cardLayouts) {
            this.cardLayouts[cardLayout!.id] = {
              name: cardLayout!.name,
              cardFields: cardLayout!.cardFields.map(field => ({ ...field })),
            }
          }

          // const cards = await this.gameInfoService.getCards(this.room.state.gameId)
          for (const card of cards) {
            const cardGame = {
              name: card.name,
              cardLayoutId: card.layoutId,
              data: card.data,
              freeDragPos: { x: -40, y: -60 },
              flipped: false,
              id: card.id,
              label: card.name,
              pileId: null,
              zIndex: 1,
              belongsTo: null,
              ruledLastPileId: firstRuledPileId,
              ruledPileId: firstRuledPileId,
              onMoveCardFromToCode: cardStringCodes.find((item: any) => item.id == card.id).onMoveCardFromToCode || null,
              onPhaseStartCode: cardStringCodes.find((item: any) => item.id == card.id).onPhaseStartCode || null,
              onPhaseEndCode: cardStringCodes.find((item: any) => item.id == card.id).onPhaseEndCode || null
            }

            this.freeModeService.addCard(cardGame)
            this.roomService.createCard(this.room.id, cardGame);
          }
        }

        //Verifica se o usuário está logado e pega ele
        await this.getCurrentPlayer();

        await this.updateRoom();

        //ouve as mudanças feitas na subcoleção de usuários
        this.subscribePlayers();

        //ouve as mudanças feitas no documento dessa sala
        this.subscribeRoom();

        //ouve as mudanças feitas na subcoleção de cartas
        this.subscribeCards();


        // Carregar o campo do jogo
        const gameId = room.state?.gameId;
        if (gameId) {
          const game = await this.gameInfoService.getGameInfoById(gameId);
          if(game) {
            this.game = game;
            this.winConditionCode = this.game.winConditionCode!;
            if(this.game.gamePhases){
              this.phases = this.game.gamePhases;
              this.totalPhases = this.phases.length;
            }
            else{
              this.phases = ['fase 1', 'fase 2', 'fase 3']
              this.totalPhases = 3;
            }

            this.phases.forEach((phase) => {
              this.onPhaseStartCodeList = {...this.onPhaseStartCodeList, [phase]: []};
              this.onPhaseEndCodeList = {...this.onPhaseEndCodeList, [phase]: []};
            });

            this.loadOnPhaseStartTriggers();
            this.loadOnPhaseEndTriggers();

            //console.log("LISTA onPhaseStart:", this.onPhaseStartCodeList);
            //console.log("LISTA onPhaseEnd:", this.onPhaseEndCodeList);
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
    // Para o loading que foi ativo no MODAL CREATE ROOM
    this.loadingService.hide();
  }

  //pega o Jogador logado, redireciona para login se não está logado ainda
  async getCurrentPlayer() {
    const currentPlayer: PlayerEntity = await this.roomService.getCurrentPlayer(
      this.room.id
    );
    this.currentPlayer = currentPlayer;
    console.log('Jogador: ', this.currentPlayer);
  }

  getTopCard(ruledPileId: string, position: {x: number, y:number}, isDragging: string) {
    const topCard = this.freeModeService.getTopCardFromRuledPile(ruledPileId);

    if (topCard) {
      if (!isDragging) {
        topCard.freeDragPos = {
          x: position.x - 40,
          y: position.y - 60
        }
      }
    }
    
    return topCard;
  }

  private async runStringCode(stringCode: string, card?: any) {

    const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;

    const func = new AsyncFunction(
      'blockCodeGeneratorsService',
      'room',
      'roomService',
      'game',
      'freeModeService',
      'toastService',
      'players',
      'currentPlayerToPlayNumber',
      'phases',
      'currentPhaseNumber',
      'card',
      'ruledPileId',
      'ruledLastPileId',
      stringCode
    );

    await func(
      this.blockCodeGeneratorsService,
      this.room,
      this.roomService,
      this.game,
      this.freeModeService,
      this.toastService,
      this.players,
      this.currentPlayerToPlayNumber,
      this.phases,
      this.currentPhaseNumber,
      card ?? null,
      card?.ruledPileId ?? null,
      card?.ruledLastPileId ?? null,
      stringCode
    );
  }

  async startGame(){
    this.isGameOcurringHTML = true;
    // Atualizando a sala para que seja visivel que o jogo já começou
    //if(this.room.state) this.room.state['isGameOcurring'] = true;
    this.roomService.updateRoom(this.room.id, {state: {...this.room.state!, isGameOcurring: true, currentphase: this.phases[0], currentPlayerToPlay: this.players[0].playerId}});

    //Começando o jogo
    this.playGame();
  }

  async playGame(){

    const playersOrderToPlay = this.players;
    this.currentPlayerToPlay = playersOrderToPlay[this.currentPlayerToPlayNumber];

    if(this.currentPlayer.playerId === this.currentPlayerToPlay.playerId){
      this.isDragDisabled = false;
    }

    //Verificar se o jogo possui uma trigger de ativação de inicio de jogo
    if(this.game.onGameStartCode){
      this.runStringCode(this.game.onGameStartCode)
    }
  }

  async nextPhase(){

    if(this.room.state?.isGameOcurring === false) return;

    //Verificar se é o turno do jogador
    if(this.currentPlayerToPlay.playerId != this.currentPlayer.playerId){
      this.toastService.showErrorToast('Ação negada', `Turno do jogador: ${this.currentPlayerToPlay.name}`);
      return;
    }

    // Acionar as triggers de fim de fase
    this.runOnPhaseEndTriggers();

    await new Promise(resolve => setTimeout(resolve, 250));

    this.currentPhaseNumber++;

    if(this.currentPhaseNumber < this.totalPhases){

      // Acionar as triggers de inicio de fase
      this.room.state!['currentphase'] = this.phases[this.currentPhaseNumber];
      this.runOnPhaseStartTriggers();

      this.toastService.showSuccessToast('Mudamos de fase', `Fase atual: ${this.phases[this.currentPhaseNumber]}`);
      this.roomService.updateRoom(this.room.id, {state: {...this.room.state!, currentphase: this.phases[this.currentPhaseNumber]}});
    }
    else{
      this.currentPhaseNumber = 0;

      this.currentPlayerToPlayNumber = (this.currentPlayerToPlayNumber+1)% this.players.length;
      const nextPlayerId = this.players[this.currentPlayerToPlayNumber].playerId;
      this.toastService.showSuccessToast('', 'Fim do turno')
      this.roomService.updateRoom(this.room.id, {state: {...this.room.state!, currentphase: this.phases[this.currentPhaseNumber], currentPlayerToPlay:nextPlayerId}});
    }
    console.log("Fase Atual: ", this.phases[this.currentPhaseNumber]);
  }

  endGame(){
    this.isGameOcurringHTML = false;
    this.roomService.updateRoom(this.room.id, {state: {...this.room.state!, isGameOcurring: false}});
  }

  loadOnPhaseStartTriggers(){

    // Verificar se o jogo possui trigger de inicio de fase
    if(this.game.onPhaseStartCode){
      this.game.onPhaseStartCode.forEach((gameOnPhaseStart) => {
        if(gameOnPhaseStart.startsWith("if ((room.state.currentphase == ")){
      
          const finalPhaseIndex = gameOnPhaseStart.indexOf("'", 33);
          const phaseName = gameOnPhaseStart.substring(33, finalPhaseIndex);
      
          if(this.phases.includes(phaseName)){
            this.onPhaseStartCodeList[phaseName].push(gameOnPhaseStart);
          }
        }
      });
    }

    // Verificar se cada possui trigger de inicio de fase
    this.freeModeService.cards().forEach((card) => {
      if(card.onPhaseStartCode){

        card.onPhaseStartCode.forEach((cardOnPhaseStart) => {
          if(cardOnPhaseStart.startsWith("if ((room.state.currentphase == ")){

            const finalPhaseIndex = cardOnPhaseStart.indexOf("'", 33);
            const phaseName = cardOnPhaseStart.substring(33, finalPhaseIndex);

            if(this.phases.includes(phaseName)){
              this.onPhaseStartCodeList[phaseName].push(cardOnPhaseStart);
            }
          }
        })
      }
    });
  }

  runOnPhaseStartTriggers(){
    if(this.onPhaseStartCodeList[this.phases[this.currentPhaseNumber]]){
      this.onPhaseStartCodeList[this.phases[this.currentPhaseNumber]].forEach(async (code) => {
        if(code){
          this.runStringCode(code);
          this.roomService.updateRoom(this.room.id, {state: {...this.room.state!}});
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      });
    }
  }

  loadOnPhaseEndTriggers(){

    // Verificar se o jogo possui trigger de inicio de fase
    if(this.game.onPhaseEndCode){
      this.game.onPhaseEndCode.forEach((gameOnPhaseEnd) => {
        if(gameOnPhaseEnd.startsWith("if ((room.state.currentphase == ")){
      
          const finalPhaseIndex = gameOnPhaseEnd.indexOf("'", 33);
          const phaseName = gameOnPhaseEnd.substring(33, finalPhaseIndex);
      
          if(this.phases.includes(phaseName)){
            this.onPhaseStartCodeList[phaseName].push(gameOnPhaseEnd);
          }
        }
      })
    }

    this.freeModeService.cards().forEach((card) => {
      if(card.onPhaseEndCode){

        card.onPhaseEndCode.forEach((cardOnPhaseEnd) => {
          if(cardOnPhaseEnd.startsWith("if ((room.state.currentphase == ")){

            const finalPhaseIndex = cardOnPhaseEnd.indexOf("'", 33);
            const phaseName = cardOnPhaseEnd.substring(33, finalPhaseIndex);

            if(this.phases.includes(phaseName)){
              this.onPhaseStartCodeList[phaseName].push(cardOnPhaseEnd);
            }
          }
        })
      }
    });
  }

  runOnPhaseEndTriggers(){
    if(this.onPhaseEndCodeList[this.phases[this.currentPhaseNumber]]){
      this.onPhaseEndCodeList[this.phases[this.currentPhaseNumber]].forEach(async (code) => {
        if(code){
          this.runStringCode(code);
          this.roomService.updateRoom(this.room.id, {state: {...this.room.state!}});
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      });
    }
  }

  private goToLoginPage(roomLink: string) {
    const queryParams: any = {
      roomUrl: "/ruled-rooms/" + roomLink,
    };

    this.router.navigate(['/login'], {
      queryParams,
    });
  }

  // =================================
  // ======= MÉTODOS DE UPDATE =======
  // =================================

  async updateRoom(): Promise<void>{
    //const newState: RoomState = {...this.room.state!, cards: this.freeModeService.cards(), ruledPiles: this.freeModeService.ruledPiles};
    const newState: RoomState = {...this.room.state!, ruledPiles: this.freeModeService.ruledPiles};
    this.roomService.updateRoom(this.room.id, { state: newState });
  }

  // =================================
  // ========== SUBSCRIÇÕES ==========
  // =================================

  //ouve as mudanças feitas no documento dessa sala
  private subscribeRoom(){
    this.roomSubscription = this.roomService
      .listenRoom(this.room.id)
      .subscribe(async (room) => {

        if(this.room.state?.isGameOcurring != room.state?.isGameOcurring){
          //console.log('NOVA SALA: ', room)
          if(room.state?.isGameOcurring === false){
            //room.state['isGameOcurring'] = false;
            //console.log("SKIBIDI 1")
            this.toastService.showSuccessToast('', 'Fim de jogo');
          }
          else if(room.state?.isGameOcurring != undefined){
            //room.state['isGameOcurring'] = true;
            //console.log("SKIBIDI 2")
            this.toastService.showSuccessToast('Divirtasse🎈🎇✨', 'Jogo Iniciando');
          }
        }

        if((this.currentPhaseNumber < 0) || (this.phases[this.currentPhaseNumber] != room.state?.currentphase)){
          this.currentPhaseNumber = this.phases.indexOf(room.state?.currentphase!);
        }

        if((room.state?.currentPlayerToPlay && this.currentPlayerToPlay == undefined) || (this.currentPlayerToPlay && this.currentPlayerToPlay.playerId != room.state?.currentPlayerToPlay)){
          const currentPlayerToPlay = this.players.find((player) => player.playerId === room.state?.currentPlayerToPlay);
          this.currentPlayerToPlay = currentPlayerToPlay!;
          this.currentPlayerToPlayNumber = this.players.indexOf(this.currentPlayerToPlay);
          if(this.currentPlayer.playerId === currentPlayerToPlay?.playerId){
            this.toastService.showSuccessToast('Sua vez de jogar', `Fase atual: ${this.phases[this.currentPhaseNumber]}`)
            this.runOnPhaseStartTriggers();
            this.isDragDisabled = false;
          }
          else{
            this.isDragDisabled = true;
          }
        }

        this.room = room;

        //if(room.state?.cards){
        //  this.freeModeService.cards.set(room.state.cards);
        //}
        if(room.state?.ruledPiles){
          this.freeModeService.ruledPiles = room.state.ruledPiles;
        }
      });
  }

  //ouve as mudanças feitas na subcoleção de usuários
  private subscribePlayers(){
    this.playerSubscription = this.roomService
      .listenPlayers(this.room.id)
      .subscribe((players) => {
        this.players = players;
      });
  }

  //ouve as mudanças feitas na subcoleção de cartas
  private subscribeCards(){
    this.cardSubscription = this.roomService
      .listenCards(this.room.id)
      .subscribe((cards) => {
        this.freeModeService.cards.set(cards);
      });
  }

  //ouve as mudanças feitas na subcoleção de cartas

  // =================================
  // ==== MOVIMENTAÇÃO DAS CARTAS ====
  // =================================

  // flipar a carta
  async doubleClick(cardId: string){
    this.freeModeService.flipCard(cardId);
    //this.updateRoom();
    const card = this.freeModeService.getCardById(cardId);
    await this.roomService.updateCard(this.room.id, cardId, {flipped: card!.flipped});
  }

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
    const cardId = event.source.element.nativeElement.getAttribute('card-id');
    if (cardId) {
       this.isDragging = cardId;
    }
    if (this.popover) {
    this.popover.hide(); // fecha o popover quando arrastar outra carta
    }

    this.freeModeService.updateZindex(cardId!, 999999999)
  }

  onDropHandle(pileId: string, coordinates: {x: number, y: number}) {
    this.isDraggingHandle = false;
    this.freeModeService.changexyOfPileCards(pileId, coordinates)
    this.updateRoom();
  }

  // Evento disparado quando se solta uma carta sendo arrastada
  async onDrop(event: CdkDragEnd<CardGame[]>) {
    this.isDragging = "";

    const draggedElement = event.source.element.nativeElement; // Pega a carta arrastada
    const draggedCardId = draggedElement.getAttribute('card-id') // Id da carta arrastada
    this.freeModeService.updateZindex(draggedCardId!, 99);
    const { x, y } = event.dropPoint; // posição do mouse no fim do drag

    // ignoramentos
    draggedElement.classList.add("remove-pointer-events"); // Ignorar a carta sendo arrastada
    const fakeTargetElement = document.elementFromPoint(x, y); // Pegar o alvo falso
    fakeTargetElement!.classList.add("remove-pointer-events"); // Ignorar o elemento fake

    const targetElement = document.elementFromPoint(x, y); // Pegar o alvo REAL!

    // remover ignoramentos
    draggedElement.classList.remove("remove-pointer-events"); // Remover o ignoramento kekw
    fakeTargetElement!.classList.remove("remove-pointer-events"); // Remover o ignoramento kekw


    const draggedCard = this.freeModeService.getCardById(draggedCardId!);

    //console.log(targetElement)
    
    if (targetElement?.id) {
      // É uma pilha
      const targetPileId = targetElement?.id; // Id da pilha

      // IGUAL AO DE ELSE IF EMBAIXO
      const targetItem = this.items.find(i => i.nameIdentifier === targetPileId);
      if (draggedCard && targetItem !== null && targetElement && targetItem?.type === 'pile') {
        
        draggedCard.freeDragPos = {
          x: targetItem.position.x - 40,
          y: targetItem.position.y - 60
        };

        if (draggedCard.ruledPileId !== targetPileId) {
          draggedCard.ruledLastPileId = draggedCard.ruledPileId ?? targetPileId;
          draggedCard.ruledPileId = targetPileId;
          this.freeModeService.addCardToRuledPile(targetPileId, draggedCard.ruledLastPileId, draggedCardId!)
        }
        

        if(draggedCard.onMoveCardFromToCode){
          await this.runStringCode(draggedCard.onMoveCardFromToCode, draggedCard);
        }
      }
    }

    else if (targetElement?.hasAttribute('card-id')) {
      const targetCardId = targetElement?.getAttribute('card-id');
      const targetCard = this.freeModeService.getCardById(targetCardId!);
      const targetPileId = targetCard?.ruledPileId;

      // IGUAL AO IF DE CIMA (nao me julgue)
      const targetItem = this.items.find(i => i.nameIdentifier === targetPileId);
      if (draggedCard && targetItem !== null && targetElement && targetItem?.type === 'pile') {
        
        draggedCard.freeDragPos = {
          x: targetItem.position.x - 40,
          y: targetItem.position.y - 60
        };

        if (draggedCard.ruledPileId !== targetPileId && targetPileId) {
          draggedCard.ruledLastPileId = draggedCard.ruledPileId ?? targetPileId;
          draggedCard.ruledPileId = targetPileId;
          this.freeModeService.addCardToRuledPile(targetPileId, draggedCard.ruledLastPileId, draggedCardId!)
        }
      }
    }

    else if (draggedCardId && draggedCard?.ruledPileId) {
      if (this.isOverHandArea) {
        if (draggedCard.ruledPileId !== 'hand') {
          this.freeModeService.changeBelongsTo(draggedCardId, this.currentPlayer!.playerId);
          this.freeModeService.removeCardFromRuledPile(draggedCardId, draggedCard?.ruledPileId, true);
        }
      } else {
        if (this.freeModeService.getCardById(draggedCardId)?.belongsTo  && draggedCard.ruledLastPileId !== 'hand') {
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
      }

      this.resizeHandArea()
    }

    //await new Promise(resolve => setTimeout(resolve, 132));
    this.updateRoom()
    await this.roomService.updateCard(this.room.id, draggedCard!.id, draggedCard!);
  }

}

// =================================
// ==== TIPAGENS PARA FACILITAR ====
// =================================

interface TriggersList{
  [key: string]: string[];
}
