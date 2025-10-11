// src/app/blockly/blockly.config.ts
import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

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
        { kind: 'category', name: 'On Game Start' },
        { kind: 'category', name: 'Win Condition' },
        {
          kind: 'category', 
          name: 'On Move Card From To',
          contents: [
          { kind: 'block', type: 'onMoveCardFromTo' },
          ]
        },
        {
          kind: 'category',
          name: 'On Phase Start',
          contents: [
          { kind: 'block', type: 'onPhaseStart' },
          ]
        },
        {
          kind: 'category',
          name: 'On Phase End',
          contents: [
          { kind: 'block', type: 'onPhaseEnd' },
          ]
        },
      ]
    },
    { 
      kind: 'sep',
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
        { kind: 'block', type: 'getGeneralVariableValue' },
      ]
    },
    {
      kind: 'category',
      name: 'Actions',
      contents: [
        { kind: 'block', type: 'MoveCardTo' },
        { kind: 'block', type: 'ChangeAttributeFromCardTo' },
        { kind: 'block', type: 'randomizePile' },
        { kind: 'block', type: 'nextPhase' },
        { kind: 'block', type: 'endGame' },
      ]
    },
    {
      kind: 'category',
      name: 'Control',
      contents: [
        {kind: 'block', type: 'controls_if'},
        {kind: 'block', type: 'logic_compare'},
        {kind: 'block', type: 'logic_operation'},
        {"kind": "block",
          "type": "controls_repeat_ext",
          "inputs": {
            "TIMES": {
              "block": {
                "type": "math_number",
                "fields": { "NUM": 10 }
              }
            }
          }
        },
      ]
    }
  ]
};

export const toolboxCard = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Triggers',
      contents: [
        { kind: 'category',
          name: 'On Move Card From To',
          contents: [
          { kind: 'block', type: 'cardOnMoveCardFromTo' },
          ]
        },
        {
          kind: 'category',
          name: 'On Phase Start',
          contents: [
          { kind: 'block', type: 'onPhaseStart' },
          { kind: 'block', type: 'cardOnPhaseStartAndCardIn' },
          ]
        },
        {
          kind: 'category',
          name: 'On Phase End',
          contents: [
          { kind: 'block', type: 'onPhaseEnd' },
          { kind: 'block', type: 'cardOnPhaseEndAndCardIn' },
          ]
        },
      ]
    },
    { 
      kind: 'sep',
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
        { kind: 'block', type: 'getGeneralVariableValue' },
        { kind: 'block', type: 'getTargetCardIdValue' },
        { kind: 'block', type: 'getCurrentPileIdValue' },
        { kind: 'block', type: 'getLastPileIdValue' },
      ]
    },
    {
      kind: 'category',
      name: 'Actions',
      contents: [
        { kind: 'block', type: 'MoveCardTo' },
        { kind: 'block', type: 'ChangeAttributeFromCardTo' },
        { kind: 'block', type: 'randomizePile' },
        { kind: 'block', type: 'nextPhase' },
        { kind: 'block', type: 'endGame' },
      ]
    },
    {
      kind: 'category',
      name: 'Control',
      contents: [
        {kind: 'block', type: 'controls_if'},
        {kind: 'block', type: 'logic_compare'},
        {kind: 'block', type: 'logic_operation'},
        {"kind": "block",
          "type": "controls_repeat_ext",
          "inputs": {
            "TIMES": {
              "block": {
                "type": "math_number",
                "fields": { "NUM": 10 }
              }
            }
          }
        },
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

  // 🚀 WIN CONDITION
  Blockly.Blocks['winCondition'] = {
    init: function() {
      this.appendDummyInput().appendField('winCondition');
      this.setNextStatement(true, null);
      this.setColour(60);
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
      this.appendDummyInput()
      .appendField('Card')
      .appendField(new Blockly.FieldTextInput('Card'), 'CARD')
      .appendField('To')
      .appendField(new Blockly.FieldTextInput('Pile'), 'PILE')
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

  // 🚀 CARD ON MOVE CARD FROM TO
  Blockly.Blocks['cardOnMoveCardFromTo'] = {
    init: function() {
      this.appendDummyInput()
      .appendField('OnMoveCard')
      .appendField('From')
      .appendField(new Blockly.FieldTextInput('Old_Pile'), 'OLD_PILE')
      .appendField('To')
      .appendField(new Blockly.FieldTextInput('New_Pile'), 'NEW_PILE')
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(120);
    }
  };

  // 🚀 CHANGE ATTRIBUTE FROM CARD TO
  Blockly.Blocks['ChangeAttributeFromCardTo'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Change Attribute')
        .appendField(new Blockly.FieldTextInput('Attribute'), 'ATTRIBUTE')
        .appendField('From')
        .appendField(new Blockly.FieldTextInput('Card'), 'CARD');
      this.appendDummyInput()
        .appendField('To')
        .appendField(new Blockly.FieldTextInput('New_attribute_Value'), 'NEW_ATTRIBUTE_VALUE');
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

  // 🚀 GET GENERAL VARIABLE VALUE
  Blockly.Blocks['getGeneralVariableValue'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Variable')
        .appendField(new Blockly.FieldTextInput('value'), 'VALUE');
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(315);
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

  // 🚀 RANDOMIZE ALL CARDS FROM PILE
  Blockly.Blocks['randomizePile'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Randomize All Cards From')
        .appendField(new Blockly.FieldTextInput('Pile'), 'PILE')
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

  // 🚀 ON PHASE START
  Blockly.Blocks['onPhaseStart'] = {
    init: function() {
      this.appendDummyInput()
      .appendField('onPhase')
      .appendField(new Blockly.FieldTextInput('Phase'), 'PHASE')
      .appendField('Start')
      this.setInputsInline(true)
      this.setOutput(true, null);
      this.setColour(120);
    }
  };

  // 🚀 CARD ON PHASE START AND CARD IN
  Blockly.Blocks['cardOnPhaseStartAndCardIn'] = {
    init: function() {
      this.appendDummyInput()
      .appendField('OnPhase')
      .appendField(new Blockly.FieldTextInput('Phase'), 'PHASE')
      .appendField('Start and Card In')
      .appendField(new Blockly.FieldTextInput('Pile'), 'PILE')
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(120);
    }
  };

  // 🚀 ON PHASE END
  Blockly.Blocks['onPhaseEnd'] = {
    init: function() {
      this.appendDummyInput()
      .appendField('onPhase')
      .appendField(new Blockly.FieldTextInput('Phase'), 'PHASE')
      .appendField('End')
      this.setInputsInline(true)
      this.setOutput(true, null);
      this.setColour(120);
    }
  };

  // 🚀 CARD ON PHASE END AND CARD IN
  Blockly.Blocks['cardOnPhaseEndAndCardIn'] = {
    init: function() {
      this.appendDummyInput()
      .appendField('OnPhase')
      .appendField(new Blockly.FieldTextInput('Phase'), 'PHASE')
      .appendField('End and Card In')
      .appendField(new Blockly.FieldTextInput('Pile'), 'PILE')
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(120);
    }
  };

  // 🚀 GET GENERAL VARIABLE VALUE
  Blockly.Blocks['getTargetCardIdValue'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('TargetCard')
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(335);
    }
  };
  
  // 🚀 GET LAST PILE ID VALUE
  Blockly.Blocks['getLastPileIdValue'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('LastPileIdValue')
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(335);
    }
  };

  // 🚀 GET CURRENT PILE ID VALUE
  Blockly.Blocks['getCurrentPileIdValue'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('CurrentPileIdValue')
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(335);
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
    const code = ''; //Todo o código que compoem a aba de onGameStart vai estar um um mesmo atributo do game/card
    return code;
  };

  // WIN CONDITION
  javascriptGenerator.forBlock['winCondition'] = function() {
    // TODO: Assemble javascript into the code variable.
    const code = ''; //Todo o código que compoem a aba de winCondition vai estar um um mesmo atributo do game/card
    return code;
  };

  // GET CARD
  javascriptGenerator.forBlock['getCard'] = function(block, generator) {
    const text_card_id = block.getFieldValue('CARD_ID');

    const code = `${text_card_id}`;
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // MOVE CARD TO
  javascriptGenerator.forBlock['MoveCardTo'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_card = block.getFieldValue('CARD');
    const value_new_pile = block.getFieldValue('PILE');

    // TODO: Assemble javascript into the code variable.
    const code = "console.log('SKIBIDILSON');console.log('CAGA BAGRE VASCAINO');";
    return code;
  };

  // GET PILE
  javascriptGenerator.forBlock['getPile'] = function(block) {
    const text_pile_id = block.getFieldValue('PILE_ID');

    const code = `${text_pile_id}`;
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // GET PHASE
  javascriptGenerator.forBlock['getPhase'] = function(block) {
    const text_phase_id = block.getFieldValue('PHASE_ID');

    // TODO: Assemble javascript into the code variable.
    const code = `${text_phase_id}`;
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
    const code = '';
    return code;
  };

  // CARD ON MOVE CARD FROM TO
  javascriptGenerator.forBlock['cardOnMoveCardFromTo'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_old_pile = block.getFieldValue('OLD_PILE');
    const value_new_pile = block.getFieldValue('NEW_PILE');

    // TODO: Assemble javascript into the code variable.
    const code = "(card.ruledPileId == " + `'${value_new_pile}'` + ") && (card.ruledLastPileId == " + `'${value_old_pile}'` + ")";
    return [code, Order.NONE];
  };

  // CHANGE ATTRIBUTE FROM CARD TO
  javascriptGenerator.forBlock['ChangeAttributeFromCardTo'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength

    const attribute_name = block.getFieldValue('ATTRIBUTE');
    const card_value = block.getFieldValue('CARD');
    const new_attribute_value = block.getFieldValue('NEW_ATTRIBUTE_VALUE');

    // TODO: Assemble javascript into the code variable.
    //const code = `blockCodeGeneratorsService.changeAttributeFromCardTo(${value_attribute}, ${value_card}, ${text_new_attribute})`;
    const code = ''
    return code;
  };

  // GET GAME ATTRIBUTE
  javascriptGenerator.forBlock['getGameAttribute'] = function(block) {
    const text_attribute = block.getFieldValue('ATTRIBUTE');

    // TODO: Assemble javascript into the code variable.
    const code = `game['${text_attribute}']`;
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // GET CARD ATTRIBUTE
  javascriptGenerator.forBlock['GetCardAttribute'] = function(block, generator) {

    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_card = generator.valueToCode(block, 'CARD', Order.ATOMIC);
    const text_attribute = block.getFieldValue('ATTRIBUTE');

    // TODO: Assemble javascript into the code variable.
    const code = `'${text_attribute}'`;
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // GET GENERAL VARIABLE VALUE
  javascriptGenerator.forBlock['getGeneralVariableValue'] = function(block, generator) {

    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_card = block.getFieldValue('VALUE');

    // TODO: Assemble javascript into the code variable.
    const code = JSON.stringify(value_card).replace(/^"|"$/g, "'");
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // NEXT PHASE
  javascriptGenerator.forBlock['nextPhase'] = function() {
    // TODO: Assemble javascript into the code variable.
    const code = 
    `if(room.state.currentphase == game.gamePhases[game.gamePhases.length-1]){
      const nextPlayernumber = (currentPlayerToPlayNumber+1)% players.length;
      const nextPlayerId = players[nextPlayernumber].playerId;
      room.state['currentphase'] = phases[0];
      room.state['currentPlayerToPlay'] = nextPlayerId;
    }
    else{
      room.state['currentphase'] = phases[currentPhaseNumber+1];
      toastService.showSuccessToast('Mudamos de fase', 'Fase atual:' + phases[currentPhaseNumber+1]);
    }`;
    return code;
  }

  javascriptGenerator.forBlock['endGame'] = function() {

    // TODO: Assemble javascript into the code variable.
    const code = "console.log('pamonha'); room.state['isGameOcurring'] = false;toastService.showSuccessToast('', 'Fim de jogo');";
    //const code = "console.log('pamonha'); roomService.updateRoom(room.id, {state: {...room.state, gameId: game.id, isGameOcurring: false}});";
    
    return code;
  }

  // RANDOMIZE ALL CARDS FROM PILE
  javascriptGenerator.forBlock['randomizePile'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_pile = block.getFieldValue('PILE');

    // TODO: Assemble javascript into the code variable.
    //const code = "(room.state.currentphase == " + `'${value_phase}'` + ") && (freeModeService.cards().find(card => card.id ==" + `'${cardId}'` +").ruledPileId == " + `'${value_pile}'` + ")";
    const code = `const pile = freeModeService.ruledPiles.find(ruledPile => ruledPile.nameIdentifier == '${value_pile}');
    const cardsArray = pile.cardIds;
    for (let i = cardsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
    [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];}`
    return code;
  };

  javascriptGenerator.forBlock['onPhaseStart'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_phase = block.getFieldValue('PHASE');

    // TODO: Assemble javascript into the code variable.
    const code = "(room.state.currentphase == " + `'${value_phase}'` + ")";
    return [code, Order.NONE];
  }

  // CARD ON PHASE START AND CARD IN
  javascriptGenerator.forBlock['cardOnPhaseStartAndCardIn'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_phase = block.getFieldValue('PHASE');
    const value_pile = block.getFieldValue('PILE');

    const cardId =  (block.workspace as Blockly.WorkspaceSvg).cardId;

    // TODO: Assemble javascript into the code variable.
    const code = "(room.state.currentphase == " + `'${value_phase}'` + ") && (freeModeService.cards().find(card => card.id ==" + `'${cardId}'` +").ruledPileId == " + `'${value_pile}'` + ")";
    //const code = "(room.state.currentphase == " + `'${value_phase}'` + ") && (freeModeService.cards())";
    return [code, Order.NONE];
  };

  javascriptGenerator.forBlock['onPhaseEnd'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_phase = block.getFieldValue('PHASE');

    // TODO: Assemble javascript into the code variable.
    const code = "(room.state.currentphase == " + `'${value_phase}'` + ")";
    return [code, Order.NONE];
  }

  // CARD ON PHASE START AND CARD IN
  javascriptGenerator.forBlock['cardOnPhaseEndAndCardIn'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_phase = block.getFieldValue('PHASE');
    const value_pile = block.getFieldValue('PILE');

    const cardId =  (block.workspace as Blockly.WorkspaceSvg).cardId;

    // TODO: Assemble javascript into the code variable.
    const code = "(room.state.currentphase == " + `'${value_phase}'` + ") && (freeModeService.cards().find(card => card.id ==" + `'${cardId}'` +").ruledPileId == " + `'${value_pile}'` + ")";
    return [code, Order.NONE];
  };

  // GET TARGET CARD ID VALUE
  javascriptGenerator.forBlock['getTargetCardIdValue'] = function(block, generator) {

    // TODO: Assemble javascript into the code variable.
    const code = ""
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // GET LAST PILE ID VALUE
  javascriptGenerator.forBlock['getLastPileIdValue'] = function(block, generator) {

    // TODO: Assemble javascript into the code variable.
    const code = "card.ruledLastPileId"
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // GET CURRENT PILE ID VALUE
  javascriptGenerator.forBlock['getCurrentPileIdValue'] = function(block, generator) {

    // TODO: Assemble javascript into the code variable.
    const code = "card.ruledPileId"
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

}
