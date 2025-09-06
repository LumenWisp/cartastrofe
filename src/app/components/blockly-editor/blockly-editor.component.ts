import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import * as Blockly from 'blockly';
import { toolbox, registerBlocks, registerGenerators } from './blockly-editor.config';
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

  constructor(private gameInfoService: GameInfoService){}

  ngAfterViewInit() {

    registerBlocks();
    registerGenerators();

    this.workspace = Blockly.inject(this.blocklyDiv.nativeElement, {
      toolbox,
      trashcan: true,
      scrollbars: false,
    });
  }

  generateCode() {
    const code = javascriptGenerator.workspaceToCode(this.workspace);
    console.log(code);
    console.log(code.length);
  }

  async saveWorkSpaceState(field: string){
    const state = Blockly.serialization.workspaces.save(this.workspace);
    console.log(state);

    if(this.game){
      await this.gameInfoService.updateGameInfo(this.game.id, {[field]: state})
    }

    // TODO: adicionar salvamento de cartas
  }

}