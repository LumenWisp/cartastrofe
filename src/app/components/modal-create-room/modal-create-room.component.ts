import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Router, RouterModule } from '@angular/router';
import { GameInfoService } from '../../services/game-info.service';
import { GameInfo } from '../../types/game-info';
import { UserEntity } from '../../types/user';
import { UserService } from '../../services/user-service.service';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-modal-create-room',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, DropdownModule, RouterModule, FormsModule],
  templateUrl: './modal-create-room.component.html',
  styleUrl: './modal-create-room.component.css'
})
export class ModalCreateRoomComponent {
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  gameOptions: any = [];
  selectedGame: any = {label: '', value:''};
  playerOptions = [];
  games: GameInfo[] = [];
  user: UserEntity | null = null;

  constructor(
    private gameInfoService: GameInfoService,
    private userService: UserService,
    private router: Router,
    private roomService: RoomService,
  ){}

  async ngOnInit(){
    this.user = this.userService.getUserLogged();
  }

  async ngOnChanges(){
    await this.loadGames();
  }

  async loadGames(){
    if(this.user) this.games = await this.gameInfoService.getGameInfos(this.user?.userID);

    this.gameOptions = this.games.map(item => ({label: item.name, value: item.id}));
    console.log(this.gameOptions)
  }

  close() {
    this.selectedGame = {label: '', value:''};
    this.display = false;
    this.displayChange.emit(this.display);
  }

  async createRoom(gameId: string): Promise<void> {

    if(typeof gameId != 'string'){
      console.error('Selecione uma sala');
      return;
    }

    try{
      console.log("ID do jogo selecionado: ", this.selectedGame);
      const room = await this.roomService.createRoom(gameId);

      if(!room){
        console.log("Não há salas disponiveis");
      }
      else{
        if(room.state) this.goToGameRoom(room.state.roomLink);
      }
    } catch (error) {
      console.error('Erro ao criar sala', error);
      throw error;
    }
  }

  private goToGameRoom(linkCode: string) {
    const queryParams: any = {
      linkCode: linkCode
    };
    
    this.router.navigate(['/rooms'], { queryParams });
  }
}
