import { Component } from '@angular/core';
import { PanelGameComponent } from '../../components/panel-game/panel-game.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ModalCreateGameComponent } from '../../components/modal-create-game/modal-create-game.component';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user-service.service';

import { GameInfo } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';

@Component({
  selector: 'app-my-games',
  imports: [PanelGameComponent, IconFieldModule, InputIconModule, InputTextModule, ModalCreateGameComponent, ButtonModule],
  templateUrl: './my-games.component.html',
  styleUrl: './my-games.component.css',
})
export class MyGamesComponent {
  gamesInfo: GameInfo[] = [];

  constructor(
    private gameInfoService: GameInfoService,
    private userService: UserService
  ){}

  ngOnInit(){
    this.gamesInfo = this.gameInfoService.getGameInfosByUserID(this.userService.getUserLogged().userID)
  }

  get games(){
    return this.gameInfoService.getGameInfosByUserID(this.userService.getUserLogged().userID)
  }

//  gamesInfo: GameInfo[] = [
//    {
//      name: 'Exploding Kittens',
//      countPlayersMin: 2,
//      countPlayersMax: 10,
//      countCards: 150,
//    },
//    {
//      name: 'Yugioh',
//      countPlayersMin: 2,
//      countPlayersMax: 2,
//      countCards: 1000,
//    },
//    {
//      name: 'Uno',
//      countPlayersMin: 2,
//      countCards: 100,
//    },
//        {
//      name: 'Exploding Kittens',
//      countPlayersMin: 2,
//      countPlayersMax: 10,
//      countCards: 150,
//    },
//    {
//      name: 'Yugioh',
//      countPlayersMin: 2,
//      countPlayersMax: 2,
//      countCards: 1000,
//    },
//    {
//      name: 'Uno',
//      countPlayersMin: 2,
//      countCards: 100,
//    },
//        {
//      name: 'Exploding Kittens',
//      countPlayersMin: 2,
//      countPlayersMax: 10,
//      countCards: 150,
//    },
//    {
//      name: 'Yugioh',
//      countPlayersMin: 2,
//      countPlayersMax: 2,
//      countCards: 1000,
//    },
//    {
//      name: 'Uno',
//      countPlayersMin: 2,
//      countCards: 100,
//    },
//        {
//      name: 'Exploding Kittens',
//      countPlayersMin: 2,
//      countPlayersMax: 10,
//      countCards: 150,
//    },
//    {
//      name: 'Yugioh',
//      countPlayersMin: 2,
//      countPlayersMax: 2,
//      countCards: 1000,
//    },
//    {
//      name: 'Uno',
//      countPlayersMin: 2,
//      countCards: 100,
//    },
//  ];

  showCreateGameDialog: boolean = false;

  showDialog() {
    this.showCreateGameDialog = true;
  }

}
