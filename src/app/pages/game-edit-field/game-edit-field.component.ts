import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { GameInfo } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { GameFieldItem } from '../../types/game-field-item';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-game-edit-field',
  imports: [ButtonModule, RouterLink, CdkDrag, CommonModule],
  templateUrl: './game-edit-field.component.html',
  styleUrl: './game-edit-field.component.css'
})
export class GameEditFieldComponent implements OnInit{
  game!: GameInfo;
  items: GameFieldItem[] = [{type: 'passPhase', position: {x: 0, y: 0}, nameIdentifier: 'passPhase'}];

  addPile() {
    this.items.push({
      type: 'pile',
      position: {x: 100, y: 100},
      nameIdentifier: ''
    });
    console.log(this.game)
  }

  addLabel() {
    this.items.push({
      type: 'label',
      position: {x: 100, y: 100},
      nameIdentifier: ''
    });
  }


  ngOnInit() {
    this.checkRouteParams();
  }

  constructor(
    private gameInfoService: GameInfoService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) {}

  /**
   * Atualiza a posição do item ao terminar o drag
   */
  onDragEnd(event: CdkDragEnd, index: number) {
    const { x, y } = event.source.getFreeDragPosition();
    this.items[index].position = { x, y };
  }

  /**
   * Salva os items no Firebase dentro do jogo
   */
  async saveField() {
    try {
      if (!this.game?.id) throw new Error('Jogo não carregado');
      await this.gameInfoService.updateGameInfo(this.game.id, {fieldItems: this.items});
      this.toastService.showSuccessToast('Salvamento concluído', 'O campo foi salvo!')
    } catch (error) {
      this.toastService.showErrorToast('Erro!', 'Não foi possível salvar o jogo')
      console.error('Erro ao salvar campo:', error);
    }
  }

  /**
   * Verifica parâmetros da rota e carrega os dados relacionados
   */
  private async checkRouteParams() {
    const gameId = this.route.snapshot.params['gameId'];
    console.log('gameId: ', gameId);
    this.game = await this.gameInfoService.getGameInfoById(gameId);
    console.log('Jogo selecionado: ', this.game);
  }

}
