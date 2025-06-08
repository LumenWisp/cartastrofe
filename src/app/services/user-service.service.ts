import { Injectable } from '@angular/core';
import { User } from '../types/user';

/**
 * Serviço para gerenciador os usuários do sistema
 *
 * Esta implementação usa o localstorage como armazenamento para:
 * - usuário registrados
 * - usuário logado
 *
 * Futuramente será trocado para um banco de dados.
 *
 * OBS.: Não utiliza dados em memória, uma vez que são voláteis e resetam quando o serviço
 * é reutilizado (por exemplo, tentar acessar uma rota manualmente faz resetar os dados).
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  // chaves para acessar o localstorage (futuramente serão
  // removidas quando o sistema estiver usando um banco de dados)
  static readonly USER_LOGGED = 'user';
  static readonly USERS = 'users';
  static readonly USER_ID = 'id';

  private setUserLogged(user: User): void {
    localStorage.setItem(UserService.USER_LOGGED, JSON.stringify(user));
  }

  /**
   * Retorna o usuário logado se houver, caso contrário, null é retornado.
   */
  getUserLogged(): User | null {
    const user = localStorage.getItem(UserService.USER_LOGGED);

    if (user === null) return null;

    return JSON.parse(user);
  }

  /**
   * Retorna se o usuário está logado ou não.
   */
  isUserLogged(): boolean {
    return localStorage.getItem(UserService.USER_LOGGED) !== null;
  }

  /**
   * Retorna a lista de usuários cadastrados.
   */
  getUsers(): User[] {
    const users = localStorage.getItem(UserService.USERS);

    if (users === null) return [];

    return JSON.parse(users);
  }

  /**
   * Retorna o próximo id de usuário e faz um auto increment para o próximo id.
   */
  private getNextUserId() {
    const userId = localStorage.getItem(UserService.USER_ID);
    let id = 0;

    if (userId !== null) id = parseInt(JSON.parse(userId)) + 1;
    localStorage.setItem(UserService.USER_ID, JSON.stringify(id));

    return id;
  }

  /**
   * Registra um usuário e o salva.
   * @param name nome do usuário
   * @param email email do usuário
   * @param password senha do usuário
   */
  registerUser(username: string, email: string, password: string): void {
    const user: User = {
      id: this.getNextUserId(),
      username,
      email,
      password,
    };

    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(UserService.USERS, JSON.stringify(users));
  }

  /**
   * Faz o login do usuário e o coloca como logado se existir o registro salvo.
   * @param email email do usuário
   * @param password senha do usuário
   */
  loginUser(email: string, password: string): void {
    const users = this.getUsers();

    const user = users.find(user => user.email === email && user.password === password)
    if (user) this.setUserLogged(user)
  }


  /**
   * Retorna se o email de um usuário existe ou não.
   * @param email email do usuário
   */
  emailExists(email: string): boolean {
    const users = this.getUsers();

    return users.some(user => user.email === email)
  }

  findUser(email: string, password: string): User {
    return this.getUsers().filter(
      (user) => user.email === email && user.password === password
    )[0];
  }
}
