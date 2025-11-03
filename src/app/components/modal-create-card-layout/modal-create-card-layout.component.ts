// angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// primeng
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
// services
import { CardLayoutService } from '../../services/card-layout.service';

@Component({
  selector: 'app-modal-create-card-layout',
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './modal-create-card-layout.component.html',
  styleUrl: './modal-create-card-layout.component.css'
})
export class ModalCreateCardLayoutComponent {
  @Input() showModal = false;
  @Output() showModalChange = new EventEmitter<boolean>();
  @Output() cardLayoutCreated = new EventEmitter<void>();

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
  });

  constructor(private cardLayoutService: CardLayoutService) {}

  close() {
    this.showModalChange.emit(false);
  }

  createCardLayout() {
    if (!this.form.valid) {
      
      return;
    }

    const { name } = this.form.getRawValue();

    this.cardLayoutService.createCardLayout(name);
    this.form.reset();
    this.showModalChange.emit(false);
    this.cardLayoutCreated.emit();
  }
}
