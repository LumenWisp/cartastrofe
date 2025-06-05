import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Estado interno da lista de usuários
  private usersSubject = new BehaviorSubject<User[]>([]);
  // Observable público para os componentes se inscreverem
  users$: Observable<User[]> = this.usersSubject.asObservable();
  private usersIDGenerator = 1;

  private userLogged: User = {userID: 0, name: '', email: '', password:''};

  constructor() {}

  setUserLogged(user: User){
    this.userLogged = user;
  }

  getUserLogged(): User{
    return this.userLogged;
  }

  // Retorna o valor atual da lista
  getUsers(): User[] {
    return this.usersSubject.value;
  }

  getUsersNextID(){
    return this.usersIDGenerator++;
  }

  // Substitui a lista inteira
  setUsers(users: User[]) {
    this.usersSubject.next(users);
  }

  // Adiciona um novo usuário à lista
  addUser(user: User) {
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, user]);
  }

  // Remove usuário por índice
  removeUser(index: number) {
    const current = [...this.usersSubject.value];
    if (index >= 0 && index < current.length) {
      current.splice(index, 1);
      this.usersSubject.next(current);
    }
  }

  // Atualiza um usuário existente por índice
  updateUser(index: number, updatedUser: User) {
    const current = [...this.usersSubject.value];
    if (index >= 0 && index < current.length) {
      current[index] = updatedUser;
      this.usersSubject.next(current);
    }
  }

  findUser(email: string, password: string): User{

    return this.getUsers().filter(user => user.email === email && user.password === password)[0];
    }

}