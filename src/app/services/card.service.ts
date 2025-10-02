import { inject, Injectable } from '@angular/core';
import { CardGame, CardModel } from '../types/card';
import { CardGameLayout, CardLayoutModel } from '../types/card-layout';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { UserService } from './user-service.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private firestore = inject(Firestore);
  private path = FirestoreTablesEnum.CARD;

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

  async deleteCard(id: string): Promise<void> {
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

  // Função para atualizar os camos de stringsCodes e workspaces do blockly
  async updateCardRules(id: string, data: Partial<CardGame>){
    const user = this.userService.currentUser();
    if (!user) throw new Error('Usuário não está logado');

    const q = query(
      collection(this.firestore, this.path),
      where('id', '==', id)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('Carta não encontrada');
    }

    const docId = snapshot.docs[0].id;
    console.log("IDDDDD", docId);

    const docRef = doc(this.firestore, this.path, docId);
    await setDoc(docRef, data, { merge: true });
  }

  async getCardWorkSpaces(id: string): Promise<any>{
    const user = this.userService.currentUser();
    if (!user) throw new Error('Usuário não está logado');

    const q = query(
      collection(this.firestore, this.path),
      where('id', '==', id)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('Carta não encontrada');
    }

    const cardGame = snapshot.docs[0].data() as CardGame;

    const workSpaceFields = {
      onMoveCardFromTo: cardGame.onMoveCardFromTo,
      onPhaseStart: cardGame.onPhaseStart,
      onPhaseEnd: cardGame.onPhaseEnd,      
    };

    return workSpaceFields;
  }
}
