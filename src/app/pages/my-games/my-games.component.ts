import { Component } from '@angular/core';
import { PanelGameComponent } from '../../components/panel-game/panel-game.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-my-games',
  imports: [PanelGameComponent, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './my-games.component.html',
  styleUrl: './my-games.component.css'
})
export class MyGamesComponent {

}
