// angular
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
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
import { ToastService } from '../../services/toast.service';
// types
import { GameInfoModel } from '../../types/game-info';
// enums
import { GameModesEnum } from '../../enum/game-modes.enum';

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

  games: WritableSignal<GameInfoModel[]> = signal([]);
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

  constructor(private gameInfoService: GameInfoService, private toastService: ToastService) {}

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

  resetFilter() {
    this.search.set('');
    this.gameMode.set(null);
  }

  loadGames() {
    this.gameInfoService.getGameInfos()
      .then(games => {
        this.games.set(games);
      }).catch(() => {
        this.toastService.showErrorToast('Erro ao carregar os jogos', 'Houve um erro ao carregar os jogos!')
      })
  }

  showModal() {
    this.showCreateGameModal = true;
  }

  removeGameInfo(id: string){
    this.games.set(this.games().filter(gameInfo => gameInfo.id !== id));
  }
}
