import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rooms',
  imports: [PanelModule, ButtonModule, RouterModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {

  nomes = ['Ana', 'Bruno', 'Carlos', 'Diana'];

}
