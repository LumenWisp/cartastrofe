import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { UserEntity } from '../types/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

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
      name: user.name,
      email: user.email,
      password: ''
    };

    await setDoc(doc(this.firestore, 'user', uid), userData);
  }

  async login(email: string, password: string): Promise<UserEntity | null> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const uid = cred.user.uid;
    const docSnap = await getDoc(doc(this.firestore, 'user', uid));

    if (docSnap.exists()) {
      this.currentUserData = docSnap.data() as UserEntity;
      return this.currentUserData;
    }

    return null;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUserData = null;
  }
}