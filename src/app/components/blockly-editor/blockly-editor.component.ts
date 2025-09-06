import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import * as Blockly from 'blockly';
import {
  toolbox,
  registerBlocks,
  registerGenerators,
} from './blockly-editor.config';
import { ButtonModule } from 'primeng/button';
import { javascriptGenerator } from 'blockly/javascript';
import { GameInfo } from '../../types/game-info';
import { CardGame } from '../../types/card';
import { GameInfoService } from '../../services/game-info.service';

@Component({
  selector: 'app-blockly-editor',
  imports: [ButtonModule],
  templateUrl: './blockly-editor.component.html',
  styleUrl: './blockly-editor.component.css',
})
export class BlocklyEditorComponent implements AfterViewInit {
  @ViewChild('blocklyDiv', { static: true }) blocklyDiv!: ElementRef;
  @Input() game: GameInfo | null = null;
  @Input() card: CardGame | null = null;

  private workspace!: Blockly.WorkspaceSvg;
  selectedCategory: string = '';

  constructor(private gameInfoService: GameInfoService) {}

  ngAfterViewInit() {
    registerBlocks();
    registerGenerators();

    this.workspace = Blockly.inject(this.blocklyDiv.nativeElement, {
      toolbox,
      trashcan: true,
      scrollbars: false,
    });

    // Escutar evento de seleção da toolbox
    this.workspace.addChangeListener((event) => {
      if (event.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
        const toolboxEvent = event as any;

        const categoryName = toolboxEvent.newItem;

        if (categoryName && categoryName != 'Variables' &&  categoryName != 'Actions' && categoryName != this.selectedCategory) {
          // Nome da categoria clicada
          this.selectedCategory = categoryName.replace(/\s+/g, "");
          this.selectedCategory = this.selectedCategory.charAt(0).toLowerCase() + this.selectedCategory.substring(1);
          this.loadWorkSpaceState();
          console.log('Categoria selecionada:', this.selectedCategory);
        }
      }
    });
  }

  generateCode() {
    const code = javascriptGenerator.workspaceToCode(this.workspace);
    console.log(code);
    console.log(code.length);
  }

  loadWorkSpaceState(): void{

    // TODO: adicionar carregamento de cartas
    let state;
    if (this.game) {
      state = this.game.onGameStart;
    }

    Blockly.serialization.workspaces.load(state, this.workspace);
  }

  async saveWorkSpaceState() {
    const state = Blockly.serialization.workspaces.save(this.workspace);
    console.log(state);

    if (this.game) {
      await this.gameInfoService.updateGameInfo(this.game.id, {
        [this.selectedCategory]: state,
      });

      const key = this.selectedCategory as keyof GameInfo;

      // TODO: deixar isso sem parecer uma gambiarra
      this.game[key] = state as never;

      console.log('WorkSpace salvo com sucesso!')
    }

    // TODO: adicionar salvamento de cartas
  }
}