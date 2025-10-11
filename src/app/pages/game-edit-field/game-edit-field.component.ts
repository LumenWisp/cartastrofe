import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';

import { GameInfoModel } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { GameFieldItem } from '../../types/game-field-item';
import { ToastService } from '../../services/toast.service';

import { GameFieldItemEnum } from '../../enum/game-field-item.enum';

@Component({
  selector: 'app-game-edit-field',
  imports: [ButtonModule, RouterLink, CdkDrag, CommonModule, PopoverModule, DropdownModule, InputTextModule, ListboxModule],
  templateUrl: './game-edit-field.component.html',
  styleUrl: './game-edit-field.component.css'
})
export class GameEditFieldComponent implements OnInit{
  game!: GameInfoModel;
  items: GameFieldItem[] = [];
  selectedItemIndex: number | null = null;
  sidebarExpanded = false;
  optionsAttribute: string[] = [];
  optionsPhase: string[] = [];
  @ViewChild('nameAttribute') nameAttribute!: ElementRef;
  @ViewChild('namePhase') namePhase!: ElementRef;

  addPile() {
    this.items.push({
      type: GameFieldItemEnum.PILE,
      position: {x: 0, y: 0},
      nameIdentifier: `PILHA_${this.items.length-1}`
    });
  }

  addLabel() {
    this.items.push({
      type: GameFieldItemEnum.LABEL,
      position: {x: 0, y: 0},
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
   * Salva a nova fase no Firebase dentro do jogo
   */
  async savePhase(namePhase: string) {
    try {
      if (!this.game?.id) throw new Error('Jogo não carregado');
      const gamePhases = [...(this.game.gamePhases ?? [])];
      if (!namePhase || gamePhases.includes(namePhase)) throw new Error('Fase sem nome ou existente');
      gamePhases.push(namePhase);
      await this.gameInfoService.updateGameInfo(this.game.id, {gamePhases: gamePhases});
      this.namePhase.nativeElement.value = '';
      this.toastService.showSuccessToast('Salvamento concluído', 'A Fase foi salva!')
      this.game.gamePhases = gamePhases;
      this.optionsPhase.push(namePhase)
    } catch (error) {
      this.toastService.showErrorToast('Erro!', 'Não foi possível salvar a fase')
      console.error('Erro ao salvar fase:', error);
    }
  }

  /**
   * Salva novo atributo de jogo no Firebase dentro do jogo
   */
  async saveAttribute(nameAttribute: string) {
    try {
      if (!this.game?.id) throw new Error('Jogo não carregado');
      const gameAttributes = [...(this.game.gameAttributes ?? [])];
      if (!nameAttribute || gameAttributes.includes(nameAttribute)) throw new Error('Atributo sem nome ou existente');
      gameAttributes.push(nameAttribute);
      await this.gameInfoService.updateGameInfo(this.game.id, {gameAttributes: gameAttributes});
      this.nameAttribute.nativeElement.value = '';
      this.toastService.showSuccessToast('Salvamento concluído', 'O Atributo foi salvo!')
      this.game.gameAttributes = gameAttributes;
      this.optionsAttribute.push(nameAttribute)
    } catch (error) {
      this.toastService.showErrorToast('Erro!', 'Não foi possível salvar o atributo')
      console.error('Erro ao salvar atributo:', error);
    }
  }

  /**
   * Verifica parâmetros da rota e carrega os dados relacionados
   */
  private async checkRouteParams() {
    const gameId = this.route.snapshot.params['gameId'];
    const game = await this.gameInfoService.getGameInfoById(gameId);
    if(game) this.game = game

    if (this.game.fieldItems && this.game.fieldItems.length > 0) {
      this.items = [...this.game.fieldItems];
    }

    else {
      this.items.push(
        {type: GameFieldItemEnum.PASSPHASE, position: {x: 0, y: 0}, nameIdentifier: 'passPhase'},
        {type: GameFieldItemEnum.HAND, position: {x: 0, y: 0}, nameIdentifier: 'hand'}
      );
    }

    this.optionsAttribute = this.game.gameAttributes ?? [];
    this.optionsPhase = this.game.gamePhases ?? [];
  }

}
