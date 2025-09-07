import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as Blockly from 'blockly';
import { toolbox, registerBlocks, registerGenerators } from './blockly-editor.config';
import { ButtonModule } from 'primeng/button';
import { javascriptGenerator } from 'blockly/javascript';

@Component({
  selector: 'app-blockly-editor',
  imports: [ButtonModule],
  templateUrl: './blockly-editor.component.html',
  styleUrl: './blockly-editor.component.css',
})
export class BlocklyEditorComponent implements AfterViewInit {
  @ViewChild('blocklyDiv', { static: true }) blocklyDiv!: ElementRef;
  private workspace!: Blockly.WorkspaceSvg;

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
  }

}