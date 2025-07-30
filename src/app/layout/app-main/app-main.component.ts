import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ModalCreateRoomComponent } from '../../components/modal-create-room/modal-create-room.component';
import { updatePreset } from '@primeng/themes';
import { AppHeaderComponent } from "../../components/app-header/app-header.component";

@Component({
  selector: 'app-app-main',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, ModalCreateRoomComponent, AppHeaderComponent],
  templateUrl: './app-main.component.html',
  styleUrl: './app-main.component.css',
})
export class AppMainComponent {
  showCreateRoomDialog: boolean = false;

  constructor() {
    updatePreset({
      semantic: {
        app: {
          body: '{primary-300}'
        }
      }
    })
  }
}
