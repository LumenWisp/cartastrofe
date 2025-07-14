import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule } from '@angular/router';
import { GameInfoService } from '../../services/game-info.service';
import { GameInfo } from '../../types/game-info';
import { UserEntity } from '../../types/user';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-modal-create-room',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, DropdownModule, RouterModule],
  templateUrl: './modal-create-room.component.html',
  styleUrl: './modal-create-room.component.css'
})
export class ModalCreateRoomComponent {
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  gameOptions: any = [];
  playerOptions = [];
  games: GameInfo[] = [];
  user: UserEntity | null = null;

  constructor(
    private gameInfoService: GameInfoService,
    private userService: UserService
  ){}

  async ngOnInit(){
    this.user = this.userService.getUserLogged();
    await this.loadGames();
  }

  async loadGames(){
    if(this.user) this.games = await this.gameInfoService.getGameInfos(this.user?.userID);
    this.games.forEach((game) => {
      this.gameOptions.push({label: game.name, value: game.name});
    })
  }

  close() {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
