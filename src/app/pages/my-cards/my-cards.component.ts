import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';

import { Card, CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';

import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CardService } from '../../services/card.service';  
import { UserService } from '../../services/user-service.service';
import { CardModel } from '../../types/card';

@Component({
  selector: 'app-my-cards',
  imports: [CardModule, ButtonModule, InputIconModule, CommonModule],
  templateUrl: './my-cards.component.html',
  styleUrl: './my-cards.component.css'
})
export class MyCardsComponent /*implements OnInit*/ {
  @ViewChild('panelscards') panelsCards: ElementRef<HTMLDivElement> | undefined;
  cards: CardModel[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService, 
    private cardService: CardService
  ) {}

  /*async ngOnInit() { 
    this.cards = await this.cardService.getCards(this.userService.getUserLogged()!.userID)
  }*/

  goToChooseLayoutPage() {
    this.router.navigate(['create-card/choose-layout'], {
      relativeTo: this.route
    });
  }
}
