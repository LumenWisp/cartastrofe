import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlocklyEditorComponent } from '../blockly-editor/blockly-editor.component';

// NG PRIME
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-game',
  imports: [ToolbarModule, ButtonModule, TabViewModule, MenuModule, BlocklyEditorComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  activeSection: string = 'cartas';

  items = [
    { label: 'CARTAS', icon: 'pi pi-clone', command: () => (this.activeSection = 'cartas')},
    { label: 'CAMPO', icon: 'pi pi-th-large', command: () => (this.activeSection = 'campo')},
    { label: 'REGRAS', icon: 'pi pi-cog', command: () => (this.activeSection = 'regras')}
  ];


  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['my-games'])
  }

}
