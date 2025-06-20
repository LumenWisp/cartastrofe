import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs';

/**
 * Serviço para gerenciar os usuários do sistema
 *
 * Esta implementação usa o localstorage como armazenamento para:
 * - usuário registrados
 * - usuário logado
 * - gerador do próximo id de usuário
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
  // chaves para acessar o localstorage (futuramente serão removidas quando o sistema estiver usando um banco de dados)
  static readonly USER_LOGGED = 'user_userLogged';
  static readonly USERS = 'user_users';
  static readonly USER_ID = 'user_id';

  constructor(private localStorageService: LocalStorageService) {}

  /**
   * Coloca o usuário como logado.
   * @param user usuário
   */
  private setUserLogged(user: User): void {
    this.localStorageService.set(UserService.USER_LOGGED, user);
  }

  /**
   * Retorna o usuário logado se houver, caso contrário, null é retornado.
   */
  getUserLogged(): User | null {
    return this.localStorageService.get(UserService.USER_LOGGED) ?? null;
  }

  /**
   * Retorna se o usuário está logado ou não.
   */
  isUserLogged(): boolean {
    return this.localStorageService.has(UserService.USER_LOGGED);
  }

  /**
   * Retorna a lista de usuários cadastrados.
   */
  getUsers(): Observable<User[]> {
    return new Observable<User[]>(observer => {
      const users = this.localStorageService.get(UserService.USERS) ?? [];
      observer.next(users);
      observer.complete();
    });
  }

  /**
   * Retorna o próximo id de usuário e faz um auto increment para o próximo id.
   */
  private getNextUserId() {
    return this.localStorageService.autoIncrement(UserService.USER_ID);
  }

  /**
   * Registra um usuário e o salva.
   * @param name nome do usuário
   * @param email email do usuário
   * @param password senha do usuário
   */
  registerUser(username: string, email: string, password: string): Observable<void> {
    return new Observable<void>(observer => {
      this.getUsers().subscribe({
        next: users => {
          if (users.some((user) => user.email === email)) {
            observer.error('Email já cadastrado');
            return;
          }

          users.push({
            id: this.getNextUserId(),
            username,
            email,
            password,
          });
          this.localStorageService.set(UserService.USERS, users);
          observer.complete();
        }
      })
    });
  }

  /**
   * Faz o login do usuário e o coloca como logado se existir o registro salvo.
   * @param email email do usuário
   * @param password senha do usuário
   */
  loginUser(email: string, password: string): Observable<void> {
    return new Observable<void>(observer => {
      this.getUsers().subscribe({
        next: users => {
          const user = users.find((user) => user.email === email && user.password === password);
          if (!user) {
            observer.error('Email ou senha inválidos');
            return;
          }

          this.setUserLogged(user);
          observer.complete();
        }
      })
    });
  }

  /**
   * Faz o logout do usuário e o retira do estado de logado se existir.
   */
  logoutUser() {
    this.localStorageService.remove(UserService.USER_LOGGED);
  }
}
