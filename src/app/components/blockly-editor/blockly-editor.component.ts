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
import { GameInfoModel } from '../../types/game-info';
import { CardGame } from '../../types/card';
import { GameInfoService } from '../../services/game-info.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-blockly-editor',
  imports: [ButtonModule],
  templateUrl: './blockly-editor.component.html',
  styleUrl: './blockly-editor.component.css',
})
export class BlocklyEditorComponent implements AfterViewInit {
  @ViewChild('blocklyDiv', { static: true }) blocklyDiv!: ElementRef;
  @Input() game: GameInfoModel | null = null;
  @Input() card: CardGame | null = null;

  private workspace!: Blockly.WorkspaceSvg;
  selectedCategory: string = '';
  selectedCategoryTitle: string = '';

  //Lista de categorias do blockly que não devem carregar um workspace
  // Ou seja, são categorias utilitárias
  utilsFields: string[] = ['Actions', 'Variables', 'Control']
  
  //Listas de categorias que abrem para outras categorias(como Triggers)
  generalFields: string[] = ['Triggers']

  constructor(private gameInfoService: GameInfoService, private toastService: ToastService) {}

  ngAfterViewInit() {
    registerBlocks();
    registerGenerators();

    this.workspace = Blockly.inject(this.blocklyDiv.nativeElement, {
      toolbox,
      trashcan: true,
      //scrollbars: true,
      move: {
      scrollbars: {
        horizontal: true,
        vertical: true
      }}
    });

    // Escutar evento de seleção da toolbox
    this.workspace.addChangeListener((event) => {
      if (event.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
        const toolboxEvent = event as any;

        const categoryName = toolboxEvent.newItem;

        if
        (
          categoryName &&
          categoryName != this.selectedCategoryTitle &&
          (!this.utilsFields.includes(categoryName)) &&
          (!this.generalFields.includes(categoryName))
        ) {
          // Nome da categoria clicada
          this.selectedCategoryTitle = categoryName;
          this.selectedCategory = categoryName.replace(/\s+/g, "");
          this.selectedCategory = this.selectedCategory.charAt(0).toLowerCase() + this.selectedCategory.substring(1);
          this.loadWorkSpaceState();
          console.log('Categoria selecionada:', this.selectedCategory);
        }
      }
    });
  }

  async saveStringCode(): Promise<void> {
    const code = javascriptGenerator.workspaceToCode(this.workspace);

    if(this.game){
      const key: string = this.selectedCategory + 'Code';

      if((!this.selectedCategory.startsWith('onPhase')) && (this.selectedCategory != 'onMoveCardFromTo')){
        console.log(code);
        await this.gameInfoService.updateGameInfo(this.game.id, {
          [key]: code,
        });
      }
      else{
        const codes = code.split('\n\n');
        console.log(codes);
        await this.gameInfoService.updateGameInfo(this.game.id, {
          [key]: codes,
        });
      }

      this.toastService.showSuccessToast('Regras salvas', 'Criação das regras concluída')
      console.log("String do código salvo com sucesso!");
    }
  }

  loadWorkSpaceState(): void {

    let state;
    if (this.game) {
      
      const key = this.selectedCategory as keyof GameInfoModel;
      state = this.game[key];
    }

    Blockly.serialization.workspaces.load(state, this.workspace);
  }

  async saveWorkSpaceState(): Promise<void> {
    const state = Blockly.serialization.workspaces.save(this.workspace);
    console.log(state);

    if (this.game) {
      await this.gameInfoService.updateGameInfo(this.game.id, {
        [this.selectedCategory]: state,
      });

      const key = this.selectedCategory as keyof GameInfoModel;

      // TODO: deixar isso sem parecer uma gambiarra
      this.game[key] = state as never;

      console.log('WorkSpace salvo com sucesso!')
    }
  }
}