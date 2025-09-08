import { Component, OnInit } from '@angular/core';
import { GameFieldItem } from '../../types/game-field-item';
import { GameInfo } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { ActivatedRoute } from '@angular/router';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { PlayerEntity } from '../../types/player';
import { TranslatePipe } from '@ngx-translate/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rule-based-room',
  imports: [CommonModule, PanelModule, ButtonModule,CdkDrag, TranslatePipe, RouterLink],
  templateUrl: './rule-based-room.component.html',
  styleUrl: './rule-based-room.component.css'
})
export class RuleBasedRoomComponent implements OnInit{
  game!: GameInfo;
  items: GameFieldItem[] = [];
  players: PlayerEntity[] = [];

  constructor(
      private gameInfoService: GameInfoService,
      private route: ActivatedRoute,
    ) {}

  ngOnInit() {
      this.checkRouteParams();
  }

  /**
   * Verifica parâmetros da rota e carrega os dados relacionados
   */
  private async checkRouteParams() {
    const gameId = this.route.snapshot.params['gameId'];
    this.game = await this.gameInfoService.getGameInfoById(gameId);

    if (this.game.fieldItems && this.game.fieldItems.length > 0) {
      this.items = [...this.game.fieldItems];
    }
    
    else {
      this.items.push({type: 'passPhase', position: {x: 0, y: 0}, nameIdentifier: 'passPhase'});
    }
  }
}
