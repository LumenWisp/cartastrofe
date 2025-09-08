// angular
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
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
import { ToastService } from '../../services/toast.service';

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
    TranslatePipe,
  ],
  templateUrl: './modal-create-game.component.html',
  styleUrl: './modal-create-game.component.css',
})
export class ModalCreateGameComponent {
  @Input() showModal = false;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() gameCreated = new EventEmitter<void>();

  translateService = inject(TranslateService);

  private readonly MIN_PLAYERS = 1;
  private readonly MAX_PLAYERS = 4;

  modes: { label: string; value: GameModesEnum }[] = [];

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

  constructor(
    private gameInfoService: GameInfoService,
    private toastService: ToastService,
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

    this.form.controls.gameMode.valueChanges.subscribe((mode) => {
      if (mode === GameModesEnum.STRUCTURED) {
        this.form.controls.countPlayersMax.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(2)
        ]);
      } 
      else {
        this.form.controls.countPlayersMax.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(4)
        ]);
      }
      this.form.controls.countPlayersMax.updateValueAndValidity();
    });
  }

  close() {
    this.showModalChange.emit(false);
  }

  createGame() {
    if (!this.form.valid) {
      console.log('Formulário inválido');
      return;
    }

    this.gameInfoService.addGameInfo(this.form.getRawValue())
      .then(gameInfo => {
        this.toastService.showSuccessToast('Jogo criado com sucesso', `O jogo "${gameInfo.name}" foi criado com sucesso!`)
      })
      .catch(() => {
        this.toastService.showErrorToast('Erro ao criar o jogo', 'Houve um erro ao criar o jogo!')
      })

    this.form.reset();
    this.showModalChange.emit(false);
    this.gameCreated.emit();
  }
}
