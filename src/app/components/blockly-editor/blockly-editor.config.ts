// src/app/blockly/blockly.config.ts
import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';
import { BlockCodeGeneratorsService } from '../../services/block-code-generators.service';

// ===============================================================
// 📦 TOOLBOX
// ===============================================================
export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Triggers',
      contents: [
        { kind: 'block', type: 'onGameStart' },
        { kind: 'block', type: 'onMoveCardFromTo' },
      ]
    },
    {
      kind: 'category',
      name: 'Variables',
      contents: [
        { kind: 'block', type: 'getCard' },
        { kind: 'block', type: 'getPile' },
        { kind: 'block', type: 'getCardAttribute' },
        { kind: 'block', type: 'getGameAttribute' },
        { kind: 'block', type: 'getPhase' },
      ]
    },
    {
      kind: 'category',
      name: 'Actions',
      contents: [
        { kind: 'block', type: 'MoveCardTo' },
        { kind: 'block', type: 'ChangeAttributeFromCardTo' },
        { kind: 'block', type: 'nextPhase' },
        { kind: 'block', type: 'endGame' },
      ]
    }
  ]
};

// ===============================================================
// 🧱 DEFINIÇÃO DOS BLOCOS
// ===============================================================
export function registerBlocks() {
  // 🚀 ON GAME START
  Blockly.Blocks['onGameStart'] = {
    init: function() {
      this.appendDummyInput().appendField('onGameStart');
      this.setNextStatement(true, null);
      this.setColour(120);
    }
  };

  // 🚀 GET CARD
  Blockly.Blocks['getCard'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Card')
        .appendField(new Blockly.FieldTextInput('card_id'), 'CARD_ID');
      this.setOutput(true, null);
      this.setColour(60);
    }
  };

  // 🚀 MOVE CARD TO
  Blockly.Blocks['MoveCardTo'] = {
    init: function() {
      this.appendValueInput('OLD_PILE').appendField('Move');
      this.appendValueInput('NEW_PILE').appendField('To');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(225);
    }
  };

  // 🚀 GET PILE
  Blockly.Blocks['getPile'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Pile')
        .appendField(new Blockly.FieldTextInput('pile_id'), 'PILE_ID');
      this.setOutput(true, null);
      this.setColour(15);
    }
  };

  // 🚀 GET PHASE
  Blockly.Blocks['getPhase'] = {
    init: function() {
      this.appendDummyInput('DUMMY')
        .appendField('Phase')
        .appendField(new Blockly.FieldTextInput('phase_id'), 'PHASE_ID');
      this.setInputsInline(true)
      this.setOutput(true, null);
      this.setColour(330);
    }
  };

  // 🚀 ON MOVE CARD FROM TO
  Blockly.Blocks['onMoveCardFromTo'] = {
    init: function() {
      this.appendValueInput('CARD').appendField('onMoveCard');
      this.appendValueInput('OLD_PILE').appendField('From');
      this.appendValueInput('NEW_PILE').appendField('To');
      this.setInputsInline(true);
      this.setNextStatement(true, null);
      this.setColour(120);
    }
  };

  // 🚀 CHANGE ATTRIBUTE FROM CARD TO
  Blockly.Blocks['ChangeAttributeFromCardTo'] = {
    init: function() {
      this.appendValueInput('ATTRIBUTE').appendField('ChangeAttribute');
      this.appendDummyInput()
        .appendField('To')
        .appendField(new Blockly.FieldTextInput('new_attribute'), 'NEW_ATTRIBUTE');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(225);
    }
  };

  // 🚀 GET GAME ATTRIBUTE
  Blockly.Blocks['getGameAttribute'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Game Attribute')
        .appendField(new Blockly.FieldTextInput('attribute_id'), 'ATTRIBUTE');
      this.setOutput(true, null);
      this.setColour(285);
    }
  };

  // 🚀 GET CARD ATTRIBUTE
  Blockly.Blocks['getCardAttribute'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Attribute')
        .appendField(new Blockly.FieldTextInput('attribute_id'), 'ATTRIBUTE');
      this.appendValueInput('CARD').appendField('From Card');
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(285);
    }
  };

  // 🚀 NEXT PHASE
  Blockly.Blocks['nextPhase'] = {
    init: function() {
      this.appendDummyInput('NextPhase')
        .appendField('NextPhase');
      this.setInputsInline(true)
      this.setPreviousStatement(true, null);
      this.setColour(225);
    }
  };

  // 🚀 END GAME
  Blockly.Blocks['endGame'] = {
    init: function() {
      this.appendDummyInput('EndGame')
        .appendField('EndGame');
      this.setInputsInline(true)
      this.setPreviousStatement(true, null);
      this.setColour(0);
    }
  };

}

// ===============================================================
// ⚙️ GERADORES DE CÓDIGO
// ===============================================================
export function registerGenerators() {
  // ON GAME START
  javascriptGenerator.forBlock['onGameStart'] = function() {
    // TODO: Assemble javascript into the code variable.
    const code = '...';
    return code;
  };

  // GET CARD
  javascriptGenerator.forBlock['getCard'] = function(block, generator) {
    const text_card_id = block.getFieldValue('CARD_ID');

    const code = `blockCodeGeneratorsService.getCard("${text_card_id}")`;
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // MOVE CARD TO
  javascriptGenerator.forBlock['MoveCardTo'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_old_pile = generator.valueToCode(block, 'OLD_PILE', Order.ATOMIC);
    const value_new_pile = generator.valueToCode(block, 'NEW_PILE', Order.ATOMIC);

    // TODO: Assemble javascript into the code variable.
    const code = '...';
    return code;
  };

  // GET PILE
  javascriptGenerator.forBlock['getPile'] = function(block) {
    const text_pile_id = block.getFieldValue('PILE_ID');

    const code = `blockCodeGeneratorsService.getPile("${text_pile_id}")`;
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // GET PHASE
  javascriptGenerator.forBlock['getPhase'] = function(block) {
    const text_phase_id = block.getFieldValue('PHASE_ID');

    // TODO: Assemble javascript into the code variable.
    const code = '...';
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // ON MOVE CARD FROM TO
  javascriptGenerator.forBlock['onMoveCardFromTo'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_card = generator.valueToCode(block, 'CARD', Order.ATOMIC);
    const value_old_pile = generator.valueToCode(block, 'OLD_PILE', Order.ATOMIC);
    const value_new_pile = generator.valueToCode(block, 'NEW_PILE', Order.ATOMIC);

    // TODO: Assemble javascript into the code variable.
    const code = '...';
    return code;
  };

  // CHANGE ATTRIBUTE FROM CARD TO
  javascriptGenerator.forBlock['ChangeAttributeFromCardTo'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_attribute = generator.valueToCode(block, 'ATTRIBUTE', Order.ATOMIC);
    const text_new_attribute = block.getFieldValue('NEW_ATTRIBUTE');

    // TODO: Assemble javascript into the code variable.
    const code = '...';
    return code;
  };

  // GET GAME ATTRIBUTE
  javascriptGenerator.forBlock['GetGameAttribute'] = function(block) {
    const text_attribute = block.getFieldValue('ATTRIBUTE');

    // TODO: Assemble javascript into the code variable.
    const code = '...';
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // GET CARD ATTRIBUTE
  javascriptGenerator.forBlock['GetCardAttribute'] = function(block, generator) {
    const text_attribute = block.getFieldValue('ATTRIBUTE');

    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_card = generator.valueToCode(block, 'CARD', Order.ATOMIC);

    // TODO: Assemble javascript into the code variable.
    const code = '...';
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // NEXT PHASE
  javascriptGenerator.forBlock['nextPhase'] = function() {
    // TODO: Assemble javascript into the code variable.
    const code = '...';
    return code;
  }

  javascriptGenerator.forBlock['endGame'] = function() {

    // TODO: Assemble javascript into the code variable.
    const code = '...';
    return code;
  }

}
