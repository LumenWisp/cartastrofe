import { Component } from '@angular/core';
import { Panel, PanelModule } from 'primeng/panel';
import { Avatar, AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-panel-game',
  imports: [PanelModule, Avatar, AvatarGroupModule, AvatarModule],
  templateUrl: './panel-game.component.html',
  styleUrl: './panel-game.component.css',
})
export class PanelGameComponent {}
