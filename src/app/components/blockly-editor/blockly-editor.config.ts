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
          { kind: 'block', type: 'onMoveCardTo' },
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
        //{ kind: 'block', type: 'getCardAttribute' },
        { kind: 'block', type: 'getGameAttribute' },
        { kind: 'block', type: 'getDroppedCardAttribute' },
        { kind: 'block', type: 'getPiletopCardAttribute' },
        { kind: 'block', type: 'getGeneralVariableValue' },
      ]
    },
    {
      kind: 'category',
      name: 'Actions',
      contents: [
        //{ kind: 'block', type: 'MoveCardTo' },
        { kind: 'block', type: 'drawFirstCardsFromPile' },
        { kind: 'block', type: 'ChangeAttributeFromCardTo' },
        { kind: 'block', type: 'isPileEmpty' },
        { kind: 'block', type: 'cancelMovement' },
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
        //{ kind: 'block', type: 'getCardAttribute' },
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
        //{ kind: 'block', type: 'MoveCardTo' },
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

  // 🚀 MOVE CARD TO
  Blockly.Blocks['MoveCardTo'] = {
    init: function() {
      this.appendDummyInput()
      .appendField('Move')
      .appendField(new Blockly.FieldTextInput('Card'), 'CARD')
      .appendField('To')
      .appendField(new Blockly.FieldTextInput('Pile'), 'PILE')
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(225);
    }
  };

  // 🚀 DRAW CARDS FROM PILE
  Blockly.Blocks['drawFirstCardsFromPile'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Draw First')
        .appendField(new Blockly.FieldTextInput('Number_Of_Cards'), 'NUMBER_OF_CARDS')
        .appendField('From Pile')
        .appendField(new Blockly.FieldTextInput('pile'), 'PILE')
      this.setInputsInline(true)
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(225);
    }
  };

  // 🚀 GET PILE TOP CARD
  Blockly.Blocks['getPiletopCardAttribute'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Get Pile Top Card Attribute')
        .appendField(new Blockly.FieldTextInput('Attribute'), 'ATTRIBUTE')
        .appendField('From Pile')
        .appendField(new Blockly.FieldTextInput('pile'), 'PILE')
      this.setOutput(true, null);
      this.setColour(15);
    }
  };

  // 🚀 IS PILE EMPTY
  Blockly.Blocks['isPileEmpty'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Is Pile')
        .appendField(new Blockly.FieldTextInput('Pile'), 'PILE')
        .appendField('Empty')
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
      .appendField('OnMoveCard From')
      .appendField(new Blockly.FieldTextInput('Old_Pile'), 'OLD_PILE')
      .appendField('To')
      .appendField(new Blockly.FieldTextInput('New_Pile'), 'NEW_PILE')
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(120);
    }
  };

  // 🚀 ON MOVE CARD TO
  Blockly.Blocks['onMoveCardTo'] = {
    init: function() {
      this.appendDummyInput()
      .appendField('On Move Card To')
      .appendField(new Blockly.FieldTextInput('Pile'), 'PILE')
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

  // 🚀 GET DROPPED CARD ATTRIBUTE
  Blockly.Blocks['getDroppedCardAttribute'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Get  Dropped Card Attribute')
        .appendField(new Blockly.FieldTextInput('Attribute'), 'ATTRIBUTE')
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour(315);
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
      this.setNextStatement(true, null);
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
      this.setNextStatement(true, null);
      this.setColour(225);
    }
  };

  // 🚀 CANCEL MOVEMENT
  Blockly.Blocks['cancelMovement'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('cancelMovement')
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
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

  // MOVE CARD TO
  javascriptGenerator.forBlock['MoveCardTo'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_card = block.getFieldValue('CARD');
    const value_new_pile = block.getFieldValue('PILE');

    // TODO: Assemble javascript into the code variable.
    const code = "console.log('SKIBIDILSON');console.log('CAGA BAGRE VASCAINO');";
    return code;
  };

  // GET PILE TOP CARD
  javascriptGenerator.forBlock['drawFirstCardsFromPile'] = function(block) {

    const number_of_cards = block.getFieldValue('NUMBER_OF_CARDS');
    const pile_value = block.getFieldValue('PILE');
    
    const code = `{const pile1 = freeModeService.ruledPiles.find(ruledPile => ruledPile.nameIdentifier == '${pile_value}');
    if (pile1?.cardIds) {
      const limit = (pile1.cardIds.length >= ${number_of_cards}) ? pile1.cardIds.length - ${number_of_cards} : 0;
      for (let i = pile1.cardIds.length - 1; i >= limit; i--) {
        const card = freeModeService.cards().find(card => card.id == pile1.cardIds[i]);
        freeModeService.changeBelongsTo(card.id, currentPlayer.playerId);
        freeModeService.removeCardFromRuledPile(card.id, card.ruledPileId, true);
        roomService.updateCard(room.id, card.id, freeModeService.getCardById(card.id));
      }
    }
  }`
    // TODO: Change Order.NONE to the correct operator precedence strength
    return code;
  };

  // GET PILE TOP CARD
  javascriptGenerator.forBlock['getPiletopCardAttribute'] = function(block) {

    const pile_value = block.getFieldValue('PILE');
    const attribute_name = block.getFieldValue('ATTRIBUTE');
    
    const code = `(() => {
    const pile = freeModeService.ruledPiles.find(ruledPile => ruledPile.nameIdentifier == '${pile_value}');
    if(pile?.cardIds && pile.cardIds.length != 0){
    const topCard = freeModeService.cards().find(card => card.id == pile.cardIds[pile.cardIds.length-1]);
    return topCard.data['${attribute_name}'];
    }
    return '132DEU ERRADO132';
    })()`
    // TODO: Change Order.NONE to the correct operator precedence strength
    return [code, Order.NONE];
  };

  // IS PILE EMPTY
  javascriptGenerator.forBlock['isPileEmpty'] = function(block) {

    const pile_value = block.getFieldValue('PILE');
    
    const code = `(freeModeService.ruledPiles.find(ruledPile => ruledPile.nameIdentifier == '${pile_value}')?.cardIds == undefined) || freeModeService.ruledPiles.find(ruledPile => ruledPile.nameIdentifier == '${pile_value}').cardIds.length == 0`
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

  // ON MOVE CARD TO
  javascriptGenerator.forBlock['onMoveCardTo'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const value_pile = block.getFieldValue('PILE');

    // TODO: Assemble javascript into the code variable.
    const code = `(targetPile && targetPile.nameIdentifier == '${value_pile}')`;
    return [code, Order.NONE];
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
    const code = `const card = freeModeService.cards().find(card => card.name == '${card_value}');
    const keys = Object.keys(card.data);
    if(keys.includes('${attribute_name}')){
      card.data['${attribute_name}'] = '${new_attribute_value}';
      roomService.updateCard(room.id, card.id, card);
    }`
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

  // GET DROPPED CARD ATTRIBUTE
  javascriptGenerator.forBlock['getDroppedCardAttribute'] = function(block, generator) {

    // TODO: change Order.ATOMIC to the correct operator precedence strength
    const attribute_name = block.getFieldValue('ATTRIBUTE');

    // TODO: Assemble javascript into the code variable.
    const code = `card.data['${attribute_name}']`;
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
    const code = `{const pile = freeModeService.ruledPiles.find(ruledPile => ruledPile.nameIdentifier == '${value_pile}');
    const cardsArray = pile.cardIds;
    console.log('KKK', cardsArray, pile);
    for (let i = cardsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
    [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];}}`
    return code;
  };

  // RANDOMIZE ALL CARDS FROM PILE
  javascriptGenerator.forBlock['cancelMovement'] = function(block, generator) {
    // TODO: change Order.ATOMIC to the correct operator precedence strength

    // TODO: Assemble javascript into the code variable.
    const code = `movementControler['cancelMovement'] = true;`
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
