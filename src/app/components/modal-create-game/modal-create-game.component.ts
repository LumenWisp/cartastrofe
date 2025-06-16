import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameInfoService } from '../../services/game-info.service';
import { GameModes } from '../../types/game-mode';

@Component({
  selector: 'app-modal-create-game',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './modal-create-game.component.html',
  styleUrl: './modal-create-game.component.css',
})
export class ModalCreateGameComponent {
  @Input() showModal = false;
  @Output() showModalChange = new EventEmitter<boolean>();

  form = new FormGroup({
    gameName: new FormControl('', [Validators.required]),
    gameMode: new FormControl(GameModes.STRUCTURED, [Validators.required]),
  });

  modes = [
    { label: 'Estruturado', value: GameModes.STRUCTURED },
    { label: 'Livre', value: GameModes.FREE },
  ];

  constructor(
    private gameInfoService: GameInfoService,
  ) {}

  close() {
    this.showModalChange.emit(false);
  }

  createGame() {
    if (this.form.valid && this.form.value.gameName) {
      this.gameInfoService.addGameInfo({
        name: this.form.value.gameName,
        countPlayersMin: 0,
        countPlayersMax: 0,
        countCards: 0,
      });
      this.close();
    }
  }
}
