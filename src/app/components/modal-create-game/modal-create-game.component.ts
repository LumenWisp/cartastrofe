import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-modal-create-game',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, DropdownModule],
  templateUrl: './modal-create-game.component.html',
  styleUrl: './modal-create-game.component.css'
})
export class ModalCreateGameComponent {
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  modes = [
    { label: 'Estruturado', value: 'estruturado' },
    { label: 'Livre', value: 'livre' },
  ];

  close() {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
