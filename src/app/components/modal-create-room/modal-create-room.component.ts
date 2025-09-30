import { Component, Input, Output, EventEmitter, signal, WritableSignal } from '@angular/core';
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

import { CardLayoutModel } from '../../types/card-layout';
import { CardLayoutService } from '../../services/card-layout.service';
import { SelectModule } from 'primeng/select';

// TYPES
import { GameInfoModel } from '../../types/game-info';

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
    SelectModule
  ],
  templateUrl: './modal-create-room.component.html',
  styleUrl: './modal-create-room.component.css',
})
export class ModalCreateRoomComponent {
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  gameInfo: WritableSignal<GameInfoModel | null> = signal(null);
  gameInfos: GameInfoModel[] = []

  constructor(
    private gameInfoService: GameInfoService,
    private router: Router,
    private roomService: RoomService,
    private toastService: ToastService,
  ) {
    this.loadGames();
  }

  loadGames() {
    this.gameInfoService.getGameInfosPlayable().then((gameInfos) => {
      this.gameInfos = gameInfos
    });
  }

  close() {
    this.displayChange.emit(false);
  }

  async createRoom(): Promise<void> {
    if (!this.gameInfo()){
      this.toastService.showErrorToast('Erro ao criar sala', 'Selecione um jogo para criar a sala');
      return;
    } 

    try {
      const room = await this.roomService.createRoom(this.gameInfo()!.id);

      if (!room) {
        this.toastService.showErrorToast('Erro ao criar sala', 'Não há salas disponíveis')
        console.log('Não há salas disponiveis');
      } else {
          if (this.gameInfo()!.gameMode === GameModesEnum.FREE) {
            this.goToGameRoom(room.roomLink, GameModesEnum.FREE);
          }

          else if (this.gameInfo()!.gameMode === GameModesEnum.STRUCTURED) {
            this.goToGameRoom(room.roomLink, GameModesEnum.STRUCTURED);
          }
      }
    } catch (error) {
      console.error('Erro ao criar sala', error);
      throw error;
    } finally {
      this.close();
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
