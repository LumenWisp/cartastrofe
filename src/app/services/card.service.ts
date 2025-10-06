import { inject, Injectable } from '@angular/core';
import { CardModel } from '../types/card';
import { CardGameLayout, CardLayoutModel } from '../types/card-layout';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { UserService } from './user-service.service';
import { UtilsService } from './utils.service';
import { GameInfoModel } from '../types/game-info';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private firestore = inject(Firestore);
  private path = FirestoreTablesEnum.CARD;
  private pathGameInfo = FirestoreTablesEnum.GAME_INFO;

  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
  ) {}

  async getAllCards() {
    const user = await this.userService.currentUser()

    if (!user) return [];

    const collectionRef = collection(this.firestore, this.path);
    const q = query(collectionRef, where('userId', '==', user.userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as CardModel) || [];
  }

  async getCardById(id: string): Promise<CardModel | null> {
    const collectionRef = collection(this.firestore, this.path);
    const q = query(collectionRef, where('id', '==', id));
    const snapshot = await getDocs(q);
    const cards = snapshot.docs.map(doc => doc.data() as CardModel) || [];
    return cards.length > 0 ? cards[0] : null;
  }

  async getCardsByLayoutId(cardLayoutId: string): Promise<CardModel[]> {
    const collectionRef = collection(this.firestore, this.path);
    const q = query(collectionRef, where('layoutId', '==', cardLayoutId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as CardModel) || [];
  }

  // método copiado do gameinfo pq tava dando dependência circular
  async getGameInfos() {
    const user = await this.userService.currentUser();

    if (user === undefined) return []
    if (user === null) throw new Error('Usuário não está logado');

    const userId = user.userId;
    const refCollection = collection(this.firestore, this.pathGameInfo);
    const queryRef = query(refCollection, where('userId', '==', userId));
    const snapshot = await getDocs(queryRef);
    const results: GameInfoModel[] = [];
    snapshot.forEach((item) => {
      results.push(item.data() as GameInfoModel);
    });

    return results;
  }

  async deleteCard(id: string): Promise<void> {
    const gameInfos = await this.getGameInfos()

    if (gameInfos.some(game => game.cardIds?.includes(id))) {
      throw new Error('Esta carta pertence a um jogo')
    }

    const collectionRef = collection(this.firestore, this.path);
    const q = query(collectionRef, where('id', '==', id));

    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error('Carta não encontrada');

    const cardDoc = snapshot.docs[0];
    const ref = doc(this.firestore, this.path, cardDoc.id);
    await deleteDoc(ref);
  }

  async updateCard(id: string, cardName: string, card: CardGameLayout, cardLayout: CardLayoutModel) {
    const user = await this.userService.currentUser()

    if (!user) throw new Error('Usuário não está logado');

    const userId = user.userId;

    const collectionRef = collection(this.firestore, this.path)
    const q = query(collectionRef, where('id', '==', id));
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error('Carta não encontrada');

    const cardDoc = snapshot.docs[0];
    const ref = doc(this.firestore, this.path, cardDoc.id);

    const data: CardModel = {
      id,
      userId,
      layoutId: cardLayout.id,
      name: cardName,
      data: card.cardFields.reduce((acc, field) => {
        acc[field.property] = field.value;
        return acc;
      }, {} as { [property: string]: string })
    }

    await setDoc(ref, data, { merge: true });
  }

  async saveCard(cardName: string, card: CardGameLayout, cardLayout: CardLayoutModel) {
    const user = await this.userService.currentUser()

    if (user === undefined) return
    if (user === null) throw new Error('Usuário não está logado');

    const userId = user.userId;

    const collectionRef = collection(this.firestore, this.path)

    const id = await this.utilsService.generateKey()

    const data: CardModel = {
      id,
      userId,
      layoutId: cardLayout.id,
      name: cardName,
      data: card.cardFields.reduce((acc, field) => {
        acc[field.property] = field.value;
        return acc;
      }, {} as { [property: string]: string })
    }

    await addDoc(collectionRef, data)
  }

  convert(card: CardModel, cardLayout: CardLayoutModel) {
    const obj: CardGameLayout = {
      name: cardLayout.name,
      cardFields: cardLayout.cardFields.map(field => ({
        ...field,
        value: card.data[field.property] || ''
      }))
    };

    return obj;
    }
}
