import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from '@angular/fire/firestore';
import { UserEntity } from '../types/user';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private path = FirestoreTablesEnum.USER;

  private currentUserData: UserEntity | null = null;

  readonly user$ = user(this.auth);
  readonly currentUser = signal<
    | {
        email: string;
        userID: string;
      }
    | null
    | undefined
  >(undefined);
  readonly currentUser$ = toObservable(this.currentUser);

  constructor() {}

  getUserLogged(): UserEntity | null {
    if (this.currentUserData) return this.currentUserData;

    const raw = localStorage.getItem('user');
    if (raw) {
      this.currentUserData = JSON.parse(raw);
      return this.currentUserData;
    }

    return null;
  }

  /**
   * Registra um novo usuário no Firebase Auth e salva os dados no Firestore.
   * @param name O nome do usuário.
   * @param email O email do usuário.
   * @param password A senha do usuário.
   */
  async register(name: string, email: string, password: string): Promise<void> {
    const { user } = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const uid = user.uid;

    const userData: UserEntity = {
      userID: uid,
      name,
      email,
      cardLayoutsIds: [],
      password,
    };

    await setDoc(doc(this.firestore, this.path, uid), userData);
  }

  /**
   * Faz login de um usuário com email e senha.
   * @param email O email do usuário.
   * @param password A senha do usuário.
   */
  async login(email: string, password: string): Promise<void> {
    // Autentica o usuário com Firebase Auth
    const { user } = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const uid = user.uid;

    // Busca os dados do Firestore com o UID
    const docSnap = await getDoc(doc(this.firestore, this.path, uid));

    if (docSnap.exists()) {
      const refCollection = collection(this.firestore, this.path);
      const queryRef = query(
        refCollection,
        where('email', '==', email),
        where('password', '==', password),
        limit(1)
      );

      const docRef = await getDocs(queryRef);

      if (!docRef.empty) {
        this.currentUserData = docRef.docs[0].data() as UserEntity;
      }
    }
  }

  forgotPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUserData = null;
    localStorage.removeItem('user');
  }
}
