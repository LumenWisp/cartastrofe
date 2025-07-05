import { Component, OnInit } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameInfoService } from '../../../services/game-info.service';
import { GameInfo } from '../../../types/game-info';

@Component({
  selector: 'app-game-description',
  imports: [SplitterModule, InputTextModule, CardModule, ButtonModule, RouterLink],
  templateUrl: './game-description.component.html',
  styleUrl: './game-description.component.css'
})
export class GameDescriptionComponent implements OnInit {
  gameInfo: GameInfo | null = null

  constructor(private route: ActivatedRoute, private gameInfoService: GameInfoService) {}

  ngOnInit(): void {
    this.getGameIdFromRoute();
  }

  getGameIdFromRoute() {
    const gameId = this.route.snapshot.paramMap.get('gameId');

    if (!gameId) return;

    // this.gameInfoService.getGameInfoById(parseInt(gameId)).subscribe({
    //   next: (data) => {
    //     this.gameInfo = data
    //   }
    // })
  }
}
