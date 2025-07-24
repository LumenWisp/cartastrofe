import { Component, Input } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { GameInfo } from '../../types/game-info';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-panel-game',
  imports: [PanelModule, AvatarGroupModule, AvatarModule],
  templateUrl: './panel-game.component.html',
  styleUrl: './panel-game.component.css',
})
export class PanelGameComponent {
  @Input({ required: true }) gameInfo!: GameInfo;

  constructor(private router: Router, private route: ActivatedRoute) {}

  get countPlayersRange(): string {
    // sem limite máximo de jogadores
    if (!this.gameInfo.countPlayersMax) {
      return `${this.gameInfo.countPlayersMin}`;
    }

    // mesmo número mínimo e máximo de jogadores
    if (this.gameInfo.countPlayersMin === this.gameInfo.countPlayersMax) {
      return `${this.gameInfo.countPlayersMin}`;
    }

    // intervalo de jogadores
    return `${this.gameInfo.countPlayersMin} - ${
      this.gameInfo.countPlayersMax || 'sem limite'
    }`;
  }

  goToDescriptionGamePage() {
    this.router.navigate(['game-description', this.gameInfo.id], {
      relativeTo: this.route,
    });
  }

  goToEditGamePage() {
    this.router.navigate(['game-edit', this.gameInfo.id], {
      relativeTo: this.route,
    })
  }
}