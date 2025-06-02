import { Injectable } from '@angular/core';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class UserLoggedService {

  private userLogged: User = {userID: 0, name: '', email: '', password:''};

  constructor() { }

  setUserLogged(user: User){
    this.userLogged = user;
  }

  getUserLogged(): User{
    return this.userLogged;
  }
}
