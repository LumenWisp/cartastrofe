// ANGULAR
import { Component, OnInit } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// SERVICES
import { GameInfoService } from '../../services/game-info.service';
import { RoomService } from '../../services/room.service';
import { UserService } from '../../services/user-service.service';

// PRIME NG
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

// TYPES
import { GameFieldItem } from '../../types/game-field-item';
import { GameInfoModel } from '../../types/game-info';
import { PlayerEntity } from '../../types/player';
import { Room, RoomState } from '../../types/room';

// NGX TRANSLATE
import { TranslatePipe } from '@ngx-translate/core';

// RXJS
import { Subscription } from 'rxjs';
import { BlockCodeGeneratorsService } from '../../services/block-code-generators.service';

// ENUM
import { GameFieldItemEnum } from '../../enum/game-field-item.enum';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-rule-based-room',
  imports: [CommonModule, PanelModule, ButtonModule,CdkDrag, TranslatePipe, RouterLink],
  templateUrl: './rule-based-room.component.html',
  styleUrl: './rule-based-room.component.css'
})
export class RuleBasedRoomComponent implements OnInit{
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

  constructor(
      private gameInfoService: GameInfoService,
      private route: ActivatedRoute,
      private roomService: RoomService,
      private userService: UserService,
      private router: Router,
      private blockCodeGeneratorsService: BlockCodeGeneratorsService,
      private toastService: ToastService
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

}
