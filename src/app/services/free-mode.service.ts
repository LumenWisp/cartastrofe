import { Injectable, signal } from '@angular/core';
import { CardGame } from '../types/card';
import { PileModel } from '../types/pile';
import { GameFieldItem } from '../types/game-field-item';

@Injectable({
  providedIn: 'root'
})
export class FreeModeService {

  cards = signal<CardGame[]>([]);

  piles: PileModel[] = [];

  // pilhas do modo regrado
  ruledPiles: GameFieldItem[] = [];

  /*
  FUNÇÕES DE CARTAS
  */

  tableCards() {
    return this.cards().filter(card => card.belongsTo === null);
  }

  myHandCards(userId: string) {
    return this.cards().filter(card => card.belongsTo === userId);
  }

  changeBelongsTo(cardId: string, userId: string | null) {
    this.cards.update(cards =>
      cards.map(c => c.id === cardId ? { ...c, belongsTo: userId } : c)
    );
  }

  addCard(card: CardGame) {
    this.cards.update(cards => [...cards, card]);
  }

  addRuledPile(ruledPile: GameFieldItem) {
    this.ruledPiles.push(ruledPile);
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

  addCardToRuledPile(ruledPileId: string,  lastRuledPileId: string, cardId: string) {

    if (ruledPileId === lastRuledPileId) return

    const ruledPile = this.ruledPiles.find(p => p.nameIdentifier === ruledPileId);
    const lastRuledPile = this.ruledPiles.find(p => p.nameIdentifier === lastRuledPileId);
    if (ruledPile) {
      if (!ruledPile.cardIds) {
        ruledPile.cardIds = []
      }
      ruledPile.cardIds?.push(cardId);
    }
    else {
      console.error('RuledPile ou carta não encontrada');
    }

    if (lastRuledPile) {
      lastRuledPile.cardIds?.pop();
    }
    else {
      console.error('LastRuledPile ou carta não encontrada');
    }

  }

  async setRuledPileForEachCard(ruledPileId: string) {
    this.cards.update(cards =>
      cards.map(c => ({
        ...c,
        ruledPile: ruledPileId,
        lastRuledPile: ruledPileId
      }))
    );
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

  getTopCardFromRuledPile(ruledPileId: string) {
    const ruledPile = this.ruledPiles.find(p => p.nameIdentifier === ruledPileId);
    if (!ruledPile?.cardIds) return null;
    const lastCardId = ruledPile.cardIds[ruledPile.cardIds.length - 1];
    const lastCard = this.getCardById(lastCardId);
    return lastCard;
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
