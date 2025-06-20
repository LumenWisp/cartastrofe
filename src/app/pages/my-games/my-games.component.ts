import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PanelGameComponent } from '../../components/panel-game/panel-game.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ModalCreateGameComponent } from '../../components/modal-create-game/modal-create-game.component';
import { ButtonModule } from 'primeng/button';
import { GameInfo } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { PanelModule } from 'primeng/panel';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-games',
  imports: [
    PanelGameComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ModalCreateGameComponent,
    ButtonModule,
    PanelModule,
    CommonModule,
  ],
  templateUrl: './my-games.component.html',
  styleUrl: './my-games.component.css',
})
export class MyGamesComponent implements OnInit {
  gameInfos$: Observable<GameInfo[]>;
  showCreateGameModal: boolean = false;

  @ViewChild('panels') panelsEl: ElementRef<HTMLDivElement> | undefined;

  constructor(private gameInfoService: GameInfoService) {
    this.gameInfos$ = this.gameInfoService.gameInfos$;
  }

  ngOnInit(): void {
    this.gameInfoService.getGameInfos().subscribe();
  }

  @HostListener('window:resize')
  remainingGameInfoSpace() {
    if (!this.panelsEl) return [];

    const style = getComputedStyle(this.panelsEl.nativeElement);
    const styleColumns = style.getPropertyValue('grid-template-columns');
    const columns = styleColumns.split(' ').length;
    const occupiedColumns = this.gameInfoService.totalGameInfos + 1
    const remainder = occupiedColumns % columns;
    const count = remainder === 0 ? columns : columns - remainder;
    return new Array(count).fill(null);
  }

  showDialog() {
    this.showCreateGameModal = true;
  }
}
