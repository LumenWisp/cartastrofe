import { Injectable, signal } from '@angular/core';
import { CardGame } from '../types/card';
import { PileModel } from '../types/pile';

@Injectable({
  providedIn: 'root'
})
export class FreeModeService {

  cards = signal<CardGame[]>([
  { id: 'A', label: 'A', flipped: false },
  { id: 'B', label: 'B', flipped: false },
  { id: 'C', label: 'C', flipped: false },
  { id: 'D', label: 'D', flipped: false },
  { id: 'E', label: 'E', flipped: false },
  { id: 'F', label: 'F', flipped: false },
]);

  piles: PileModel[] = [];

  addCard(card: CardGame) {
    this.cards.update(cards => [...cards, card]);
  }

  addCards(newCards: CardGame[]) {
    this.cards.update(cards => [...cards, ...newCards]);
  }

  removeCard(cardId: string) {
    this.cards.update(cards => cards.filter(c => c.id !== cardId));
  }

  // Limpa as cartas e pilhas
  clearCards() {
    this.cards.set([]);
    this.piles = [];
  }

  // Retorna a carta a partir de seu id
  getCardById(cardId: string) {
    return this.cards().find(card => card.id === cardId);
  }

  // Inverte o atributo flipped
  flipCard(id: string) {
    this.cards.update(cards =>
      cards.map(c => c.id === id ? { ...c, flipped: !c.flipped } : c)
    );
  }

  // Retorna o id da pilha em que a carta está, se tiver
  checkCardHasPile(cardId: string) {
    return this.cards().find(c => c.id === cardId)?.pileId;
  }

  // Adiciona uma carta para uma pilha !!SE PASSE O ID E NÃO A CARTA EM SI!! pois vamos pegar a carta pelo getCardById
  addCardToPile(pileId: string, cardId: string) {

    // Adiciona o id da pilha na carta
    this.cards.update(cards =>
        cards.map(c =>
          c.id === cardId ? { ...c, pileId: pileId } : c
        )
      );

    const updatedCard = this.getCardById(cardId);

    // Adiciona a carta na pilha
    const pile = this.piles.find(p => p.id === pileId);
    if (pile) {
      pile.cards.push(updatedCard!);
    } else {
      console.error('Pilha não encontrada');
    }
  }


  // Remove uma carta de uma pilha
  removeCardFromPile(pileId: string, card: CardGame) {

    // Remove o id da pilha da carta
    this.cards.update(cards =>
      cards.map(c => c.id === card.id ? { ...c, pileId: '' } : c)
    );

    // Remove a carta da pilha
    const pile = this.piles.find(p => p.id === pileId);
    if (pile) {
      pile.cards = pile.cards.filter(c => c.id !== card.id);
    } else {
      console.error('Pilha não encontrada');
    }

  }

  // Cria uma pilha com o id passado
  createPile(pileId: string) {
    const newPile: PileModel = {
      id: pileId,
      cards: []
    };
    this.piles.push(newPile);
  }

  // Retorna o id da pilha de uma carta pelo seu id
  getPileIdFromCardId(cardId: string) {
    const card = this.getCardById(cardId);
    return card?.pileId;
  }
}
