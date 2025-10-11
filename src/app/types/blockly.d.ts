import * as Blockly from 'blockly';

declare module 'blockly' {
  interface WorkspaceSvg {
    cardId?: string;
  }
}