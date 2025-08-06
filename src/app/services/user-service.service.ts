import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, collection, query, where, getDocs, limit } from '@angular/fire/firestore';
import { UserEntity } from '../types/user';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';
import { CardLayoutModel } from '../types/card-layout';

@Injectable({ providedIn: 'root' })
export class UserService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private path = FirestoreTablesEnum.USER;

  private currentUserData: UserEntity | null = null;

  constructor() {

    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(this.firestore, 'user', user.uid));
        if (docSnap.exists()) {
          this.currentUserData = docSnap.data() as UserEntity;
        }
      } else {
        this.currentUserData = null;
      }
    });
  }

  getUserLogged(): UserEntity | null {
    return this.currentUserData;
  }

  async register(user: UserEntity): Promise<void> {
    const cred = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
    const uid = cred.user.uid;

    const userData: UserEntity = {
      userID: uid,
      name: user.name,
      email: user.email,
      password: '',
      cardLayoutsIds: [],
    };

    await setDoc(doc(this.firestore, 'user', uid), userData);
  }

  async login(email: string, password: string): Promise<UserEntity | null> {
    // Autentica o usuário com Firebase Auth
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const uid = cred.user.uid;

    // Busca os dados do Firestore com o UID
    const docSnap = await getDoc(doc(this.firestore, this.path, uid));

    if(docSnap.exists()){
      const refCollection = collection(this.firestore, this.path);
      const queryRef = query(refCollection, where('email', '==', email), where('password', '==', password), limit(1));

      const docRef = await getDocs(queryRef)

      if (!docRef.empty) {
        this.currentUserData = docRef.docs[0].data() as UserEntity;
        return this.currentUserData;
      }
    }

    return null;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUserData = null;
  }
}
