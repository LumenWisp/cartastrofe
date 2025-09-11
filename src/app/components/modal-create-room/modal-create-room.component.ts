import { Component, Input, Output, EventEmitter, signal, WritableSignal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Router, RouterModule } from '@angular/router';
import { GameInfoService } from '../../services/game-info.service';
import { GameInfoModel } from '../../types/game-info';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { TranslatePipe } from '@ngx-translate/core';
import { CardLayoutModel } from '../../types/card-layout';
import { CardLayoutService } from '../../services/card-layout.service';
import { SelectModule } from 'primeng/select';

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
    private roomService: RoomService
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
    if (!this.gameInfo()) return

    try {
      const room = await this.roomService.createRoom(this.gameInfo()!.id);

      if (!room) {
        console.log('Não há salas disponiveis');
      } else {
        if (room.state) this.goToGameRoom(room.roomLink);
      }
    } catch (error) {
      console.error('Erro ao criar sala', error);
      throw error;
    } finally {
      this.close();
    }
  }

  private goToGameRoom(roomLink: string) {
    this.router.navigate(['/rooms', roomLink]);
  }
}
