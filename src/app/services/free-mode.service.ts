import { Injectable, signal } from '@angular/core';
import { CardGame } from '../types/card';
import { PileModel } from '../types/pile';

@Injectable({
  providedIn: 'root'
})
export class FreeModeService {

  cards = signal<CardGame[]>([
  { id: 'A', label: 'A', flipped: false, zIndex: 1, freeDragPos: {x: 0, y: 0} },
  { id: 'B', label: 'B', flipped: false, zIndex: 1, freeDragPos: {x: 0, y: 0} },
  { id: 'C', label: 'C', flipped: false, zIndex: 1, freeDragPos: {x: 0, y: 0} },
  { id: 'D', label: 'D', flipped: false, zIndex: 1, freeDragPos: {x: 0, y: 0} },
  { id: 'E', label: 'E', flipped: false, zIndex: 1, freeDragPos: {x: 0, y: 0} },
  { id: 'F', label: 'F', flipped: false, zIndex: 1, freeDragPos: {x: 0, y: 0} },
]);

  piles: PileModel[] = [];

  /*
  FUNÇÕES DE CARTAS
  */ 

  addCard(card: CardGame) {
    this.cards.update(cards => [...cards, card]);
  }

  addCards(newCards: CardGame[]) {
    this.cards.update(cards => [...cards, ...newCards]);
  }

  // Atualiza o signal cards
  updateCard(card: CardGame) {
    this.cards.update(cards =>
      cards.map(c => c.id === card.id ? { ...card } : c)
    );
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

  // Atualiza o zindex de uma carta
  updateZindex(cardId: string, zIndex: number) {
    this.cards.update(cards =>
      cards.map(c =>
        c.id === cardId ? { ...c, zIndex } : c
      )
    );
  }

  // Retorna o id da pilha em que a carta está, se tiver
  checkCardHasPile(cardId: string) {
    return this.cards().find(c => c.id === cardId)?.pileId;
  }

  // Retorna true se a carta está em uma pilha de mais de 1 carta
  isPartOfPile(cardId: string) {
    const pileId = this.getPileIdFromCardId(cardId)
    const pile = this.piles.find(pile => pile.id === pileId)
    return !!(pile && pile.cards.length > 1);
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

      const newZIndex = pile.cards.length;
      this.updateZindex(cardId, newZIndex);
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

  /*
  FUNÇÕES DE PILHAS
  */ 

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

  // Retorna o número de cartas em uma pilha
  getNumberOfCardsFromPileId(pileId: string) {
    const pile = this.piles.find(p => p.id === pileId);
    if (!pile?.cards) return;
    return pile?.cards.length;
  }

  // Retorna a carta no topo de uma pilha
  getTopCard(pileId: string) {
    const pile = this.piles.find(p => p.id === pileId);
    if (!pile?.cards) return;
    return pile?.cards[pile.cards.length - 1];
  }

  // Verifica se uma carta está no topo de uma pilha
  isTopCard(cardId: string) {
    const card = this.getCardById(cardId);
    const topCard = this.getTopCard(card?.pileId!)
    return cardId === topCard?.id;
  }

  changexyOfPileCards(pileId: string, coordinates: {x: number, y:number}) {
    const pile = this.piles.find(p => p.id === pileId)
    pile?.cards.forEach(card => {
      this.cards.update(cards =>
        cards.map(c =>
          c.pileId === pileId
            ? { ...c, freeDragPos: { ...coordinates } }
            : c
        )
      );
    });
  }

  /*
  FUNÇÕES DE EMBARALHAMENTO
  */ 

  // Embaralha uma pilha
  shufflePile(pileId: string) {
    const pile = this.piles.find(p => p.id === pileId);
    if (!pile) return;

    this.fisherYatesAlgorithm(pile.cards);

    // Atualiza o zIndex das cartas da pilha "nova"
    pile.cards.forEach((card, index) => {
      this.updateZindex(card.id!, index + 1);
  });
  }

  // Algoritmo para embaralhar aleatoriamente
  fisherYatesAlgorithm(list: CardGame[]) {
    for (let i = list.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [list[i], list[random]] = [list[random], list[i]];
  }
  return list;
  }
}
