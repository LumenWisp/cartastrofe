import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameInfo } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { UserLoggedService } from '../../services/user-logged.service';

@Component({
  selector: 'app-modal-create-game',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, DropdownModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modal-create-game.component.html',
  styleUrl: './modal-create-game.component.css'
})
export class ModalCreateGameComponent {
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  gameName: string = ''
  gameMode: string = ''
  game: GameInfo = {
    gameInfoID : 0,
    name : '',
    countPlayersMin : 0,
    countPlayersMax : 0,
    countCards : 0,
    userID : 0
  }

  modes = [
    { label: 'Estruturado', value: 'estruturado' },
    { label: 'Livre', value: 'livre' },
  ];


  constructor(
    private gameInfoService: GameInfoService,
    private userLoggedService: UserLoggedService
  ){}

  close() {
    this.display = false;
    this.displayChange.emit(this.display);
  }

  createGame(){

    this.gameInfoService.addGameInfo(
      {
        gameInfoID: this.gameInfoService.getGameInfoNextID(),
        name: this.gameName,
        countPlayersMin: 0,
        countPlayersMax: 0,
        countCards: 0,
        userID: this.userLoggedService.getUserLogged().userID
      }
    );

    console.log(this.gameInfoService.getGameInfos())
    console.log(this.gameInfoService.getGameInfosByUserID(this.userLoggedService.getUserLogged().userID))
  }
}
