import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';

import { GameInfo } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { GameFieldItem } from '../../types/game-field-item';
import { ToastService } from '../../services/toast.service';

import { GameFieldItemEnum } from '../../enum/game-field-item.enum';

@Component({
  selector: 'app-game-edit-field',
  imports: [ButtonModule, RouterLink, CdkDrag, CommonModule, PopoverModule],
  templateUrl: './game-edit-field.component.html',
  styleUrl: './game-edit-field.component.css'
})
export class GameEditFieldComponent implements OnInit{
  game!: GameInfo;
  items: GameFieldItem[] = [];
  selectedItemIndex: number | null = null;

  addPile() {
    this.items.push({
      type: GameFieldItemEnum.PILE,
      position: {x: 100, y: 100},
      nameIdentifier: `item_${this.items.length}`
    });
    console.log(this.game)
  }

  addLabel() {
    this.items.push({
      type: GameFieldItemEnum.LABEL,
      position: {x: 100, y: 100},
      nameIdentifier: `item_${this.items.length}`
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

    onItemClick(event: MouseEvent, index: number, popover: Popover) {
      event.preventDefault();
      this.selectedItemIndex = index;
      popover.toggle(event); // abre/fecha no clique
    }

    deleteItem(index: number, popover: Popover) {
      this.items.splice(index, 1);
      this.selectedItemIndex = null;
      popover.hide();
    }


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
    this.game = await this.gameInfoService.getGameInfoById(gameId);

    if (this.game.fieldItems && this.game.fieldItems.length > 0) {
      this.items = [...this.game.fieldItems];
    }
    
    else {
      this.items.push(
        {type: GameFieldItemEnum.PASSPHASE, position: {x: 0, y: 0}, nameIdentifier: 'passPhase'}, 
        {type: GameFieldItemEnum.HAND, position: {x: 0, y: 0}, nameIdentifier: 'hand'}
      );
    }
  }

}
