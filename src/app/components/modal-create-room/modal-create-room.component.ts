import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PRIMENG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

// SERVICES
import { GameInfoService } from '../../services/game-info.service';
import { UserService } from '../../services/user-service.service';
import { RoomService } from '../../services/room.service';
import { ToastService } from '../../services/toast.service';

// ENUMS
import { GameModesEnum } from '../../enum/game-modes.enum';

// NGX TRANSLATE
import { TranslatePipe } from '@ngx-translate/core';

// TYPES
import { GameInfo } from '../../types/game-info';

@Component({
  selector: 'app-modal-create-room',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    RouterModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './modal-create-room.component.html',
  styleUrl: './modal-create-room.component.css',
})
export class ModalCreateRoomComponent {
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  gameOptions: any = [];
  selectedGame: any = { label: '', value: '' };
  playerOptions = [];
  games: GameInfo[] = [];
  user!: { email: string, userID: string; } | null | undefined;

  constructor(
    private gameInfoService: GameInfoService,
    private userService: UserService,
    private router: Router,
    private roomService: RoomService,
    private toastService: ToastService,
  ) {}

  async ngOnInit() {
    this.user = this.userService.currentUser();
  }

  async ngOnChanges() {
    await this.loadGames();
  }

  async loadGames() {
    if(this.user) this.games = await this.gameInfoService.getGameInfos();
    this.gameOptions = [];
    this.games.forEach((game) => {
      this.gameOptions.push({label: game.name, value: game.id});
    })
  }

  close() {
    this.selectedGame = { label: '', value: '' };
    this.display = false;
    this.displayChange.emit(this.display);
  }

  async createRoom(gameId: string): Promise<void> {
    if (typeof gameId != 'string') {
      this.toastService.showErrorToast('Erro ao criar sala', 'Selecione um jogo para criar a sala')
      return;
    }

    try {
      console.log('ID do jogo selecionado: ', this.selectedGame);
      const room = await this.roomService.createRoom(gameId);

      if (!room) {
        console.log('Não há salas disponiveis');
      } else {

        const game = await this.gameInfoService.getGameInfoById(gameId);

        if (room.state) {
          if (game.gameMode === GameModesEnum.FREE) {
            this.goToGameRoom(room.roomLink, GameModesEnum.FREE);
          }

          else if (game.gameMode === GameModesEnum.STRUCTURED) {
            this.goToGameRoom(room.roomLink, GameModesEnum.STRUCTURED);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao criar sala', error);
      throw error;
    }
  }

  private goToGameRoom(roomLink: string, mode: GameModesEnum) {
    if (mode === GameModesEnum.FREE) {
      this.router.navigate(['/rooms', roomLink]);
    }
    else {
      this.router.navigate(['/ruled-rooms', roomLink]);
    }
  }
}
