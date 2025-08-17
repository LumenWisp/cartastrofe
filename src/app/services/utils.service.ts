import { Injectable } from '@angular/core';

import {
  format,
  parseISO
} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Formata um objeto de data para uma string no formato especificado.
   *
   * @param value - O objeto de data a ser formatado.
   * @param dateFormat - O formato desejado para a string de data (padrão: 'yyyy-MM-dd').
   * @returns Uma string formatada representando a data.
   */
  formatDate(value: Date, dateFormat = 'yyyy-MM-dd'): string {
    // Converte o objeto de data para uma string no formato ISO 8601
    const isoString = value.toISOString();
    // Analisa a string ISO 8601 para obter um objeto de data
    const parsedDate = parseISO(isoString);
    // Formata o objeto de data conforme o formato especificado
    const formattedDate = format(parsedDate, dateFormat);

    // Retorna a string de data formatada
    return formattedDate;
  }

  async generateKey(zise: number = 20): Promise<string> {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < zise; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return Promise.resolve(`${this.formatDate(new Date(), 'yyyyMMdd')}-${key}`);
  }

  /**
   * Limita um valor para que fique dentro de um intervalo específico.
   * @param value - O valor que será verificado e ajustado.
   * @param min - O valor mínimo permitido.
   * @param max - O valor máximo permitido.
   * @returns O valor ajustado, garantindo que `min <= value <= max` .
   */
  checkRange(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
  }
}
