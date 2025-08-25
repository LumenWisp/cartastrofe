// angular
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
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
import { GameModesEnum } from '../../enum/game-modes.enum';
// services
import { GameInfoService } from '../../services/game-info.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

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
    TranslatePipe
  ],
  templateUrl: './modal-create-game.component.html',
  styleUrl: './modal-create-game.component.css',
})
export class ModalCreateGameComponent {
  @Input() showModal = false;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() gameCreated = new EventEmitter<void>();

  translateService = inject(TranslateService);

  private readonly MIN_PLAYERS = 2;
  private readonly MAX_PLAYERS = 99;

  modes: { label: string; value: GameModesEnum }[] = [];

  constructor(
    private gameInfoService: GameInfoService
  ){ }

  ngOnInit(){

    forkJoin({
      gameModeStructured: this.translateService.get('game-mode.structured'),
      gameModeFree: this.translateService.get('game-mode.free')
    }).subscribe(translations => {
      this.modes = [
        { label: translations.gameModeStructured, value: GameModesEnum.STRUCTURED },
        { label: translations.gameModeFree, value: GameModesEnum.FREE },
      ];
    })
  }

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    gameMode: new FormControl(GameModesEnum.STRUCTURED, {
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
