import { Component, signal } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { UserEntity } from '../../types/user';
import { UserService } from '../../services/user-service.service';

import { CdkDrag, CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CardModel } from '../../types/card';
import { PileModel } from '../../types/pile';


@Component({
  selector: 'app-rooms',
  imports: [PanelModule, ButtonModule, DragDropModule, RouterModule, CdkDrag ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {

  users: UserEntity[] = [];

  constructor(
    private userService: UserService
  ){}

  async ngOnInit(){
    const userCreator = this.userService.getUserLogged()
    if(userCreator){
      this.users.push(userCreator);
    }
  }

  // Criando as cartas
  cards = signal<CardModel[]>([
    { id: 'c1', label: 'A', flipped: false },
    { id: 'c2', label: 'K', flipped: true },
    { id: 'c3', label: 'Q', flipped: false },
  ]);

  // Criando as pilhas
  piles = signal<PileModel[]>([
    { id: 'p1', cards: this.cards() }
  ]);


  // Inverte o boolean "flipped"
  flipCard(id: string) {
    this.cards.update(cards =>
      cards.map(c => c.id === id ? { ...c, flipped: !c.flipped } : c)
    );
  }

  // Evento disparado quando uma carta é solta sobre outra
  drop(event: CdkDragEnd<CardModel[]>) {
    
  }

}
