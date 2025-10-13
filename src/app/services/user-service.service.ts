import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  limit
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

  readonly user$ = user(this.auth);
  readonly _currentUser = signal<
    | UserEntity
    | null
    | undefined
  >(undefined);

  constructor() {}

  async currentUser() {
    if (this._currentUser()) {
      return this._currentUser()
    }

    const auth = getAuth()
    const currentUser = auth.currentUser
    const id = currentUser?.uid

    if (id) {
      this._currentUser.set(await this.getUserById(id))
    }

    return this._currentUser();
  }


  async getUserById(uid: string) {
    const refCollection = collection(this.firestore, this.path);
    const queryRef = query(refCollection, where('userId', '==', uid));
    const snapshot = await getDocs(queryRef);
    const userInfo = snapshot.docs[0]?.data() as UserEntity;
    return userInfo;
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
      userId: uid,
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
//        this.currentUserData = docRef.docs[0].data() as UserEntity;
//        localStorage.setItem('user', JSON.stringify(this.currentUserData));
      }
    }
  }

  forgotPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this._currentUser.set(null);
  }
}
