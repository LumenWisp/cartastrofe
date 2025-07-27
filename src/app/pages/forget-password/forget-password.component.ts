import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormBase } from '../../shared/form-base';

@Component({
  selector: 'app-forget-password',
  imports: [FloatLabelModule, InputTextModule, ButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css', '../../shared/auth.css'],
})
export class ForgetPasswordComponent extends FormBase {
  resetRequested = false;

  constructor() {
    const form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    const errorMessages = {
      email: {
        required: 'Email é obrigatório',
        email: 'Email inválido',
      },
    };

    super(form, errorMessages);
  }

  async submit() {
    if (this.form.valid) {
      this.resetRequested = true;
      console.log('Solicitação de redefinição enviada');
      // Aqui você pode chamar o serviço de envio de email
    } else {
      console.log('Formulário inválido');
    }
  }
}
