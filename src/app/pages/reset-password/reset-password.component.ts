import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormBase } from '../../shared/form-base';

@Component({
  selector: 'app-reset-password',
  imports: [FloatLabelModule, PasswordModule, ButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css', '../../shared/auth.css'],
})
export class ResetPasswordComponent extends FormBase {
  constructor() {
    const form = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    const errorMessages = {
      password: {
        required: 'Senha é obrigatória',
        minlength: 'Senha deve ter pelo menos 6 caracteres',
      },
    };

    super(form, errorMessages);
  }

  async submit() {
    if (this.form.valid) {
      console.log('Senha redefinida com sucesso');
      // Aqui você pode chamar o serviço de redefinição de senha
    } else {
      console.log('Formulário inválido');
    }
  }
}
