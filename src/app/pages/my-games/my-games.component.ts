// angular
import { Component, computed, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { GameModes } from '../../enum/game-mode';

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
    PlaceholderGridComponent,
    FormsModule,
    SelectButtonModule,
],
  templateUrl: './my-games.component.html',
  styleUrl: './my-games.component.css',
})
export class MyGamesComponent {
  showCreateGameModal = false;

  modes = [
    { label: 'Estruturado', value: GameModes.STRUCTURED },
    { label: 'Livre', value: GameModes.FREE },
  ];

  games: WritableSignal<GameInfo[]> = signal([]);
  search = signal('');
  gameMode = signal<GameModes | null>(null);

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

  ngOnInit() {
    this.loadGames();
  }

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
            gameMode: GameModes.STRUCTURED,
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
            gameMode: GameModes.FREE,
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
