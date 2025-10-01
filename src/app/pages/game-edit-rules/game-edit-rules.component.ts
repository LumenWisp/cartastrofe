import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { GameRulesComponent } from "../../components/game-rules/game-rules.component"
import { TabsModule } from 'primeng/tabs';
import { CardRulesComponent } from "../../components/card-rules/card-rules.component";

@Component({
  selector: 'app-game-edit-rules',
  imports: [ButtonModule, GameRulesComponent, TabsModule, CardRulesComponent],
  templateUrl: './game-edit-rules.component.html',
  styleUrl: './game-edit-rules.component.css'
})
export class GameEditRulesComponent {


}
