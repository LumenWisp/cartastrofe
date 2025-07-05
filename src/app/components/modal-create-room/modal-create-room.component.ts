import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-modal-create-room',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, DropdownModule, RouterModule],
  templateUrl: './modal-create-room.component.html',
  styleUrl: './modal-create-room.component.css'
})
export class ModalCreateRoomComponent {
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  gameOptions = [];

  playerOptions = [];

  close() {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
