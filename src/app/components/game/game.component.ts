import { Component } from '@angular/core';
import { Router } from '@angular/router';

// NG PRIME
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-game',
  imports: [ToolbarModule, ButtonModule, TabViewModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['my-games'])
  }

}
