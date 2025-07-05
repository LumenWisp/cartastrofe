import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SplitterModule } from 'primeng/splitter';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-game-description',
  imports: [RouterOutlet, SplitterModule, InputTextModule, CardModule],
  templateUrl: './game-description.component.html',
  styleUrl: './game-description.component.css'
})
export class GameDescriptionComponent {

}
