// angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// primeng
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
// enums
import { GameModes } from '../../enum/game-mode';
// services
import { GameInfoService } from '../../services/game-info.service';

@Component({
  selector: 'app-modal-create-game',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
    SelectButtonModule,
    TooltipModule,
    TextareaModule,
    InputNumberModule,
  ],
  templateUrl: './modal-create-game.component.html',
  styleUrl: './modal-create-game.component.css',
})
export class ModalCreateGameComponent {
  @Input() showModal = false;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() gameCreated = new EventEmitter<void>();

  private readonly MIN_PLAYERS = 2;
  private readonly MAX_PLAYERS = 99;

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    gameMode: new FormControl(GameModes.STRUCTURED, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    countPlayersMin: new FormControl(this.MIN_PLAYERS, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(this.MIN_PLAYERS),
        Validators.max(this.MAX_PLAYERS)
      ]
    }),
    countPlayersMax: new FormControl(this.MAX_PLAYERS, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(this.MIN_PLAYERS),
        Validators.max(this.MAX_PLAYERS)
      ]
    }),
  });

  modes = [
    { label: 'Estruturado', value: GameModes.STRUCTURED, description: 'Jogo com regras' },
    { label: 'Livre', value: GameModes.FREE, description: 'Jogo sem regras' },
  ];

  constructor(
    private gameInfoService: GameInfoService
  ) {}

  close() {
    this.showModalChange.emit(false);
  }

  async createGame() {
    if (!this.form.valid) {
      console.log('Formulário inválido');
      return;
    }

    await this.gameInfoService.addGameInfo(this.form.getRawValue());

    this.form.reset();
    this.showModalChange.emit(false);
    this.gameCreated.emit();
  }
}
