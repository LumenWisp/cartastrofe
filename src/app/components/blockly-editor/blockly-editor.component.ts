import { Component, ElementRef, OnInit, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

@Component({
  selector: 'app-blockly-editor',
  imports: [],
  templateUrl: './blockly-editor.component.html',
  styleUrl: './blockly-editor.component.css',
  schemas: [NO_ERRORS_SCHEMA]
})
export class BlocklyEditorComponent implements OnInit {
  @ViewChild('blocklyDiv', { static: true }) blocklyDiv!: ElementRef;
  @ViewChild('toolbox', { static: true }) toolbox!: ElementRef;

  ngOnInit() {

    const toolbox = {
    "kind": "categoryToolbox",
    "contents": [
      {
        "kind": "category",
        "name": "Control",
        "contents": [
          {
            "kind": "block",
            "type": "controls_if"
          },
        ]
      },
      {
        "kind": "category",
        "name": "Logic",
        "contents": [
          {
            "kind": "block",
            "type": "logic_compare"
          },
          {
            "kind": "block",
            "type": "logic_operation"
          },
          {
            "kind": "block",
            "type": "logic_boolean"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Triggers",
        "contents": [
          {
            "kind": "block",
            "type": "onGameStart",
          },
        ]
      }

    ]
  };

    // Cria o workspace
    const workspace = Blockly.inject('blocklyDiv', {
      toolbox: toolbox,
      trashcan: true,
    });

    // Criação dos blocos personalizados

    // ===============================================================
    // 🚀 ON GAME START
    // ===============================================================

    Blockly.Blocks['onGameStart'] = {
      init: function() {
        this.appendDummyInput('ONGAMESTART')
          .appendField('onGameStart');
        this.setNextStatement(true, null);
        this.setColour(120);
      }
    };

    javascriptGenerator.forBlock['onGameStart'] = function() {
      // TODO: Assemble javascript into the code variable.
      const code = '...';
      return code;
    }    
  }
}