import { Component } from '@angular/core';
import { PanelGameComponent } from '../../components/panel-game/panel-game.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ModalCreateGameComponent } from '../../components/modal-create-game/modal-create-game.component';
import { ButtonModule } from 'primeng/button';

import { GameInfo } from '../../types/game-info';

@Component({
  selector: 'app-my-games',
  imports: [PanelGameComponent, IconFieldModule, InputIconModule, InputTextModule, ModalCreateGameComponent, ButtonModule],
  templateUrl: './my-games.component.html',
  styleUrl: './my-games.component.css',
})
export class MyGamesComponent {
  gamesInfo: GameInfo[] = [
    {
      name: 'Exploding Kittens',
      description: 'Joguin do gato explosivo cabum.',
      countPlayersMin: 2,
      countPlayersMax: 10,
      countCards: 150,
    },
    {
      name: 'Yugioh',
      description: 'Joguin do protagonista que mais roubou na história dos jogos de cartas.',
      countPlayersMin: 2,
      countPlayersMax: 2,
      countCards: 1000,
    },
    {
      name: 'Uno',
      description: 'Joguin de destruição de amizades.',
      countPlayersMin: 2,
      countCards: 100,
    },
  ];

  showCreateGameDialog: boolean = false;

  showDialog() {
    this.showCreateGameDialog = true;
  }

}
