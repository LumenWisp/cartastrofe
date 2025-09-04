import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as Blockly from 'blockly';
import { toolbox, registerBlocks, registerGenerators } from './blockly-editor.config';

@Component({
  selector: 'app-blockly-editor',
  imports: [],
  templateUrl: './blockly-editor.component.html',
  styleUrl: './blockly-editor.component.css',
  schemas: []
})
export class BlocklyEditorComponent implements AfterViewInit {
  @ViewChild('blocklyDiv', { static: true }) blocklyDiv!: ElementRef;

  ngAfterViewInit() {

    registerBlocks();
    registerGenerators();

    Blockly.inject(this.blocklyDiv.nativeElement, {
      toolbox,
      trashcan: true,
      scrollbars: false,
    });
  }
}