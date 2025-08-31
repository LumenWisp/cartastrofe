// angular
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
// primeng
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { SelectButtonModule } from 'primeng/selectbutton';
// components
import { ModalCreateGameComponent } from '../../components/modal-create-game/modal-create-game.component';
import { PanelGameComponent } from '../../components/panel-game/panel-game.component';
import { PlaceholderGridComponent } from "../../components/placeholder-grid/placeholder-grid.component";
// services
import { GameInfoService } from '../../services/game-info.service';
// types
import { GameInfo } from '../../types/game-info';
// enums
import { GameModesEnum } from '../../enum/game-modes.enum';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-games',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ModalCreateGameComponent,
    PanelGameComponent,
    ButtonModule,
    PanelModule,
    CommonModule,
    TranslatePipe,
    PlaceholderGridComponent,
    FormsModule,
    SelectButtonModule,
],
  templateUrl: './my-games.component.html',
  styleUrl: './my-games.component.css',
})
export class MyGamesComponent {
  showCreateGameModal = false;
  modes: { label: string; value: GameModesEnum }[] = [];
  translateService = inject(TranslateService);

  ngOnInit() {
    this.loadGames();

    forkJoin({
      gameModeStructured: this.translateService.get('game-mode.structured'),
      gameModeFree: this.translateService.get('game-mode.free')
    }).subscribe(translations => {
      this.modes = [
        { label: translations.gameModeStructured, value: GameModesEnum.STRUCTURED },
        { label: translations.gameModeFree, value: GameModesEnum.FREE },
      ];
    });
  }


  games: WritableSignal<GameInfo[]> = signal([]);
  search = signal('');
  gameMode = signal<GameModesEnum | null>(null);

  filteredGames = computed(() => {
    let games = this.games();

    if (this.search()) {
      games = games.filter(game => {
        return game.name.toLowerCase().includes(this.search().toLowerCase());
      });
    }

    if (this.gameMode()) {
      games = games.filter(game => game.gameMode === this.gameMode());
    }

    return games;
  });

  constructor(private gameInfoService: GameInfoService) {}

  resetFilter() {
    this.search.set('');
    this.gameMode.set(null);
  }

  loadGames() {
    this.gameInfoService.getGameInfos().subscribe({
      next: (games) => {
        // dados mockados para testes
        // this.games.set(games);
        this.games.set([
          {
            id: '1',
            name: 'Game 1',
            description: 'Description for Game 1',
            countPlayersMin: 2,
            countPlayersMax: 4,
            countCards: 0,
            gameMode: GameModesEnum.STRUCTURED,
            title: '???',
            userId: 'user1',
          },
          {
            id: '2',
            name: 'Game 2',
            description: 'Description for Game 2',
            countPlayersMin: 3,
            countPlayersMax: 7,
            countCards: 6,
            gameMode: GameModesEnum.FREE,
            title: '???',
            userId: 'user1',
          },
        ]);
      },
      error: (error) => {
        console.error('Error loading games:', error);
      }
    });
  }

  showModal() {
    this.showCreateGameModal = true;
  }
}
