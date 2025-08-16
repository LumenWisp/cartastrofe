import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
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
import { GameModes } from '../../enum/game-mode';
import { GameInfo } from '../../types/game-info';
import { UserService } from '../../services/user-service.service';
import { UserEntity } from '../../types/user';
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
    RadioButtonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './modal-create-game.component.html',
  styleUrl: './modal-create-game.component.css',
})
export class ModalCreateGameComponent {
  @Input() showModal = false;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() loadGame = new EventEmitter<void>();

  translateService = inject(TranslateService);

  user: UserEntity | null = null;
  
  modes: { label: string; value: GameModes }[] = [];

  constructor(
    private userService: UserService,
    private gameInfoService: GameInfoService
  ){ }

  ngOnInit(){
    this.user = this.userService.getUserLogged();

    forkJoin({
      gameModeStructured: this.translateService.get('game-mode.structured'),
      gameModeFree: this.translateService.get('game-mode.free')
    }).subscribe(translations => {  
      this.modes = [
        { label: translations.gameModeStructured, value: GameModes.STRUCTURED },
        { label: translations.gameModeFree, value: GameModes.FREE },
      ];
    })
  }

  form = new FormGroup({
    gameName: new FormControl('', [Validators.required]),
    gameMode: new FormControl(GameModes.STRUCTURED, [Validators.required]),
  });


  close() {
    this.showModalChange.emit(false);
  }

  async createGame() {

    if(this.form.valid){
      
      const gameName = this.form.get('gameName')?.value;

      if(gameName && this.user){

        const gameInfo: GameInfo = {
        id: '',
        name: gameName,
        description: 'parelelepipedo',
        title: 'onichan',
        countPlayersMin: 2,
        countPlayersMax: 11,
        countCards: 25,
        userId: this.user?.userID
        }
        await this.gameInfoService.addGameInfo(gameInfo);
      }

    }
    this.showModalChange.emit()
    this.loadGame.emit()
  }
}
