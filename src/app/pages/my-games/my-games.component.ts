import { Component } from '@angular/core';
import { PanelGameComponent } from '../../components/panel-game/panel-game.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ModalCreateGameComponent } from '../../components/modal-create-game/modal-create-game.component';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-my-games',
  imports: [PanelGameComponent, IconFieldModule, InputIconModule, InputTextModule, ModalCreateGameComponent, ButtonModule],
  templateUrl: './my-games.component.html',
  styleUrl: './my-games.component.css'
})
export class MyGamesComponent {

  showCreateGameDialog: boolean = false;

  showDialog() {
    this.showCreateGameDialog = true;
  }

}
