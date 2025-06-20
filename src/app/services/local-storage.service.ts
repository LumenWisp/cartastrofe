import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  /**
   * Pega o item associado a `key` no `localStorage`.
   *
   * Se a `key` não existir no `localStorage`, undefined é retornado.
   * @param key chave a ser buscada
   */
  get(key: string): any {
    const value = localStorage.getItem(key);
    if (value === null) return;
    return JSON.parse(value);
  }

  /**
   * Salva o `value` para a `key` no `localStorage`.
   * @param key chave do valor a ser salvo
   * @param value valor a ser salvo
   */
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Verifica se a `key` existe no `localStorage`.
   * @param key chave a ser verificada
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Remove a chave e valor a partir da `key` no `localStorage`.
   * @param key chave para remover
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Faz o incremento automaticamente de um valor numérico associado a `key`, salva o novo valor e o retorna.
   *
   * Se `key` não existir, 0 é retornado.
   *
   * Se o valor associado a `key` não for numérico, um erro é lançado
   *
   * @param key chave associada a um valor numérico
   * @throws `Error` se valor associado a `key` não for numérico
   */
  autoIncrement(key: string): number {
    const value = this.get(key);

    // verifica se o valor existe
    if (value === undefined) {
      this.set(key, 0);
      return 0;
    }

    if (typeof value !== 'number') throw new Error(`O valor associado a ${key} não é numérico: ${value}`);

    const next = value + 1;
    this.set(key, next);
    return next;
  }
}
