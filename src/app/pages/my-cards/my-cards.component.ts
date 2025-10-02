import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../../services/card.service';
import { Card } from '../../types/card';
import { Card3dComponent } from '../../components/card-3d/card-3d.component';

@Component({
  selector: 'app-my-cards',
  standalone: true,
  imports: [CommonModule, Card3dComponent],
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.css']
})
export class MyCardsComponent implements OnInit {
  cards: Card[] = [];
  selectedCardId: string | null = null;
  
  constructor(private cardService: CardService) {}
  
  async ngOnInit() {
    await this.cardService.getCards();
    this.cardService.cards$.subscribe(cards => {
      this.cards = cards;
    });
  }

  onCardClick(card: Card) {
    // redirecionar para a página de edição da carta
  }
}
