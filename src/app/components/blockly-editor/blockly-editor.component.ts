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
        "name": "Triggers",
        "contents": [
          {
            "kind": "block",
            "type": "onGameStart",
          },
          {
            "kind": "block",
            "type": "onMoveCardFromTo",
          },
        ]
      },
      {
        "kind": "category",
        "name": "Variables",
        "contents": [
          {
            "kind": "block",
            "type": "getCard",
          },
          {
            "kind": "block",
            "type": "getPile",
          },
          {
            "kind": "block",
            "type": "getCardAttribute",
          },
          {
            "kind": "block",
            "type": "getGameAttribute",
          },
        ]
      },
      {
        "kind": "category",
        "name": "Actions",
        "contents": [
          {
            "kind": "block",
            "type": "MoveCardTo",
          },
          {
            "kind": "block",
            "type": "ChangeAttributeFromCardTo",
          },
        ]
      }

    ]
  };

    // Cria o workspace
    const workspace = Blockly.inject('blocklyDiv', {
      toolbox: toolbox,
      trashcan: true,
      scrollbars: false,
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
    
    // ===============================================================
    // 🚀 GET CARD
    // ===============================================================

    Blockly.Blocks['getCard'] = {
      init: function() {
        this.appendDummyInput('DUMMY')
          .appendField('Card')
          .appendField(new Blockly.FieldTextInput('card_id'), 'CARD_ID');
        this.setInputsInline(true)
        this.setOutput(true, null);
        this.setColour(60);
      }
    };

    javascriptGenerator.forBlock['getCard'] = function(block, generator) {
      const text_card_id = block.getFieldValue('CARD_ID');

      // TODO: Assemble javascript into the code variable.
      const code = '...';
      // TODO: Change Order.NONE to the correct operator precedence strength
      return [code, Order.NONE];
    }

    // ===============================================================
    // 🚀 MOVE CARD TO
    // ===============================================================

    Blockly.Blocks['MoveCardTo'] = {
      init: function() {
        this.appendValueInput('OLD_PILE')
          .appendField('Move');
        this.appendValueInput('NEW_PILE')
          .appendField('To');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(225);
      }
    };

    javascriptGenerator.forBlock['MoveCardTo'] = function(block, generator) {
      // TODO: change Order.ATOMIC to the correct operator precedence strength
      const value_old_pile = generator.valueToCode(block, 'OLD_PILE', Order.ATOMIC);

      // TODO: change Order.ATOMIC to the correct operator precedence strength
      const value_new_pile = generator.valueToCode(block, 'NEW_PILE', Order.ATOMIC);

      // TODO: Assemble javascript into the code variable.
      const code = '...';
      return code;
    }

    // ===============================================================
    // 🚀 GET PILE
    // ===============================================================

    Blockly.Blocks['getPile'] = {
      init: function() {
        this.appendDummyInput('DUMMY')
          .appendField('Pile')
          .appendField(new Blockly.FieldTextInput('pile_id'), 'PILE_ID');
        this.setInputsInline(true)
        this.setOutput(true, null);
        this.setColour(15);
      }
    };

    javascriptGenerator.forBlock['GetPile'] = function(block) {
      const text_pile_id = block.getFieldValue('PILE_ID');

      // TODO: Assemble javascript into the code variable.
      const code = '...';
      // TODO: Change Order.NONE to the correct operator precedence strength
      return [code, Order.NONE];
    }

    // ===============================================================
    // 🚀 ON MOVE CARD FROM TO
    // ===============================================================

    Blockly.Blocks['onMoveCardFromTo'] = {
      init: function() {
        this.appendValueInput('CARD')
          .appendField('onMoveCard');
        this.appendValueInput('OLD_PILE')
          .appendField('From');
        this.appendValueInput('NEW_PILE')
          .appendField('To');
        this.setInputsInline(true)
        this.setNextStatement(true, null);
        this.setColour(120);
      }
    };

    javascriptGenerator.forBlock['onMoveCardFromTo'] = function(block, generator) {
      // TODO: change Order.ATOMIC to the correct operator precedence strength
      const value_card = generator.valueToCode(block, 'CARD', Order.ATOMIC);

      // TODO: change Order.ATOMIC to the correct operator precedence strength
      const value_old_pile = generator.valueToCode(block, 'OLD_PILE', Order.ATOMIC);

      // TODO: change Order.ATOMIC to the correct operator precedence strength
      const value_new_pile = generator.valueToCode(block, 'NEW_PILE', Order.ATOMIC);

      // TODO: Assemble javascript into the code variable.
      const code = '...';
      return code;
    }

    // ===============================================================
    // 🚀 CHANGE ATTRIBUTE FROM CARD TO
    // ===============================================================

    Blockly.Blocks['ChangeAttributeFromCardTo'] = {
      init: function() {
        this.appendValueInput('ATTRIBUTE')
          .appendField('ChangeAttribute');
        this.appendDummyInput('DUMMY')
          .appendField('To')
          .appendField(new Blockly.FieldTextInput('new_attribute'), 'NEW_ATTRIBUTE');
        this.setInputsInline(true)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(225);
      }
    };

    javascriptGenerator.forBlock['ChangeAttributeFromCardTo'] = function(block, generator) {
      // TODO: change Order.ATOMIC to the correct operator precedence strength
      const value_attribute = generator.valueToCode(block, 'ATTRIBUTE', Order.ATOMIC);

      const text_new_attribute = block.getFieldValue('NEW_ATTRIBUTE');

      // TODO: Assemble javascript into the code variable.
      const code = '...';
      return code;
    }

    // ===============================================================
    // 🚀 GET GAME ATTRIBUTE
    // ===============================================================

    Blockly.Blocks['getGameAttribute'] = {
      init: function() {
        this.appendDummyInput('DUMMY')
          .appendField('Game Attribute')
          .appendField(new Blockly.FieldTextInput('attribute_id'), 'ATTRIBUTE');
        this.setInputsInline(true)
        this.setOutput(true, null);
        this.setColour(285);
      }
    };

    javascriptGenerator.forBlock['GetGameAttribute'] = function(block) {
      const text_attribute = block.getFieldValue('ATTRIBUTE');

      // TODO: Assemble javascript into the code variable.
      const code = '...';
      // TODO: Change Order.NONE to the correct operator precedence strength
      return [code, Order.NONE];
    }

    // ===============================================================
    // 🚀 GET CARD ATTRIBUTE
    // ===============================================================

    Blockly.Blocks['getCardAttribute'] = {
      init: function() {
        this.appendDummyInput('DUMMY')
          .appendField('Attribute')
          .appendField(new Blockly.FieldTextInput('attribute_id'), 'ATTRIBUTE');
        this.appendValueInput('CARD')
          .appendField('From Card');
        this.setInputsInline(true)
        this.setOutput(true, null);
        this.setTooltip('');
        this.setHelpUrl('');
        this.setColour(285);
      }
    };

    javascriptGenerator.forBlock['GetCardAttribute'] = function(block, generator) {
      const text_attribute = block.getFieldValue('ATTRIBUTE');

      // TODO: change Order.ATOMIC to the correct operator precedence strength
      const value_card = generator.valueToCode(block, 'CARD', Order.ATOMIC);

      // TODO: Assemble javascript into the code variable.
      const code = '...';
      // TODO: Change Order.NONE to the correct operator precedence strength
      return [code, Order.NONE];
    }



  }
}