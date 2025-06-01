import { Component, Input } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { GameInfo } from '../../types/game-info';
import { RouterOutlet } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-panel-game',
  imports: [PanelModule, AvatarGroupModule, AvatarModule, RouterOutlet],
  templateUrl: './panel-game.component.html',
  styleUrl: './panel-game.component.css',
})
export class PanelGameComponent {
  @Input({ required: true }) gameInfo!: GameInfo;

  constructor(
    private router: Router,
    private route: ActivatedRoute){}

  get countPlayersRange(): string {
    // Sem limite máximo de jogadores
    if (!this.gameInfo.countPlayersMax) {
      return `${this.gameInfo.countPlayersMin}`;
    }

    // Mesmo número mínimo e máximo de jogadores
    if (this.gameInfo.countPlayersMin === this.gameInfo.countPlayersMax) {
      return `${this.gameInfo.countPlayersMin}`;
    }

    // Intervalo de jogadores
    return `${this.gameInfo.countPlayersMin} - ${this.gameInfo.countPlayersMax || 'sem limite'}`;
  }

  goToDescriptionGamePage(){
    console.log(this.route)

    this.router.navigate(['game-description'], {
      relativeTo: this.route
    });
  }
}
