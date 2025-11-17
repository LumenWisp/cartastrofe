import * as Blockly from 'blockly';
import {
  toolboxCard,
  registerBlocks,
  registerGenerators,
} from '../blockly-editor/blockly-editor.config';
import { javascriptGenerator } from 'blockly/javascript';
import { CardGame } from '../../types/card';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GameInfoModel } from '../../types/game-info';
import { GameInfoService } from '../../services/game-info.service';
import { DrawerModule } from 'primeng/drawer';
import { CardGameLayout, CardLayout } from '../../types/card-layout';
import { CardGameLayoutComponent } from '../card-game-layout/card-game-layout.component';
import { Card3dComponent } from "../card-3d/card-3d.component";
import { CardService } from '../../services/card.service';
import { DialogModule } from 'primeng/dialog';
import { PanelMenuModule } from 'primeng/panelmenu';

type CardListItem = { id: string, layoutId: string, name: string, card: CardGameLayout}

@Component({
  selector: 'app-card-rules',
  imports: [
    ButtonModule,
    RouterLink,
    DrawerModule,
    CardGameLayoutComponent,
    Card3dComponent,
    DialogModule,
    PanelMenuModule,
  ],
  templateUrl: './card-rules.component.html',
  styleUrl: './card-rules.component.css',
})
export class CardRulesComponent {
  @ViewChild('blocklyDiv', { static: true }) blocklyDiv!: ElementRef;
  game!: GameInfoModel;
  visible = false;
  cardLayouts: { [id: string]: CardLayout } = {};
  cards: CardListItem[] = [];
  cardSelected: CardListItem | null = null;
  cardSelectedWorkspaces: any;

  visibleTutorial = false;
  text = 'Escolha um tópico no menu à esquerda para ver a explicação.';

  items = [
    {
      label: 'Triggers',
      items: [
        {
          label: 'On Move Card From To',
          command: () => {
            this.text = '[Esse gatilho será ativado quando a CARTA especificada for movida para a PILHA especificada (seja por eventos de outros gatilhos, ou por movimentações manuais).]';
          }
        },
        {
          label: 'On Phase Start',
          command: () => {
            this.text = '[Esse gatilho será ativado no início da FASE especificada.]';
          }
        },
        {
          label: 'On Phase End',
          command: () => {
            this.text = '[Esse gatilho executará seu código no final da FASE especificada.]';
          }
        },
      ]
    },
    {
      label: 'Variables',
      command: () => {
        this.text = '[texto explicativo sobre variável]';
      }
    },
    {
      label: 'Actions',
      command: () => {
        this.text = '[texto explicativo sobre a ação Move Card]';
      }
    },
    {
      label: 'Control',
      command: () => {
        this.text = '[texto explicativo sobre a estrutura If]';
      }
    }
  ];

  private workspace!: Blockly.WorkspaceSvg;
  selectedCategory: string = '';
  selectedCategoryTitle: string = '';

  //Lista de categorias do blockly que não devem carregar um workspace
  // Ou seja, são categorias utilitárias
  utilsFields: string[] = ['Actions', 'Variables', 'Control'];

  //Listas de categorias que abrem para outras categorias(como Triggers)
  generalFields: string[] = ['Triggers'];

  async ngOnInit() {
    await this.checkRouteParams();
    await this.loadCards();
  }

  ngAfterViewInit() {
    registerBlocks();
    registerGenerators();

    this.workspace = Blockly.inject(this.blocklyDiv.nativeElement, {
      toolbox: toolboxCard,
      trashcan: true,
      //scrollbars: true,
      move: {
        scrollbars: {
          horizontal: false,
          vertical: true,
        },
      },
    });

    this.workspace.cardId = '';

    // Escutar evento de seleção da toolbox
    this.workspace.addChangeListener((event) => {
      if (event.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
        const toolboxEvent = event as any;

        const categoryName = toolboxEvent.newItem;

        if (
          categoryName &&
          categoryName != this.selectedCategoryTitle &&
          !this.utilsFields.includes(categoryName) &&
          !this.generalFields.includes(categoryName)
        ) {
          // Nome da categoria clicada
          this.selectedCategoryTitle = categoryName;
          this.selectedCategory = categoryName.replace(/\s+/g, '');
          this.selectedCategory =
            this.selectedCategory.charAt(0).toLowerCase() +
            this.selectedCategory.substring(1);
          this.loadWorkSpaceState();

        }
      }
    });
  }

  constructor(
    private gameInfoService: GameInfoService,
    private route: ActivatedRoute,
    private cardService:CardService
  ) {}

  async selectCard(cardObj: CardListItem) {
    this.cardSelected = cardObj;
    if(this.cardSelected){
      this.workspace.cardId = this.cardSelected.id;
      await this.getCardSelectedWorkSpace();

      if(this.selectedCategory){
        this.loadWorkSpaceState();
      }
    }
  }

  async loadCards() {
    const cards = await this.gameInfoService.getCardsInGame(this.game.id);
    const cardLayouts = await this.gameInfoService.getCardLayouts(this.game.id);

    for (const cardLayout of cardLayouts) {
      this.cardLayouts[cardLayout!.id] = {
        name: cardLayout!.name,
        cardFields: cardLayout!.cardFields.map((field) => ({ ...field })),
      };
    }

    // Convert cards into CardGameLayout
    this.cards = cards.map((card) => ({
      id: card.id,
      name: card.name,
      layoutId: card.layoutId,
      card: {
        name: card.name,
        cardFields: this.cardLayouts[card.layoutId].cardFields.map((field) => {
          return {
            ...field,
            value: card.data[field.property],
          };
        }),
      },
    }));
  }

  /**
   * Verifica parâmetros da rota e carrega os dados relacionados
   */
  private async checkRouteParams() {
    const gameId = this.route.snapshot.params['gameId'];

    const game = await this.gameInfoService.getGameInfoById(gameId);
    if (game) this.game = game;

  }

  async getCardSelectedWorkSpace(): Promise<void>{
    this.cardSelectedWorkspaces = await this.cardService.getCardWorkSpaces(this.cardSelected?.id!);

  }

  loadWorkSpaceState(): void {

    let state;
    if (this.cardSelectedWorkspaces) {
      const key = this.selectedCategory;
      state = this.cardSelectedWorkspaces[key];
    }

    if(state) Blockly.serialization.workspaces.load(state, this.workspace);

  }

  async saveStringCode(): Promise<void> {
    const code = javascriptGenerator.workspaceToCode(this.workspace);

    if (this.game && this.cardSelected) {
      const key: string = this.selectedCategory + 'Code';

      if(!this.selectedCategory.startsWith('onPhase')){

        await this.cardService.updateCardRules(this.cardSelected.id, {
          [key]: code,
        });
      }
      else{
        const codes = code.split('\n\n');

        await this.cardService.updateCardRules(this.cardSelected.id, {
          [key]: codes,
        });
      }


    }
  }

  async saveWorkSpaceState(): Promise<void> {
    const state = Blockly.serialization.workspaces.save(this.workspace);


    if (this.game && this.cardSelected) {
      await this.cardService.updateCardRules(this.cardSelected.id, {
        [this.selectedCategory]: state,
      });

      this.cardSelectedWorkspaces[this.selectedCategory] = state;


    }
  }

  showDialog() {
    this.visibleTutorial = true;
    this.text = 'Escolha um tópico no menu à esquerda para ver a explicação.';
  }
}
