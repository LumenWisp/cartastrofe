// angular
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
// primeng
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
// shared
import { FormManager } from '../../shared/form-manager';

@Component({
  selector: 'app-reset-password',
  imports: [FloatLabelModule, PasswordModule, ButtonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css', '../../shared/auth.css'],
})
export class ResetPasswordComponent extends FormManager implements OnDestroy {
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

  ngOnDestroy() {
    this.cleanUp();
  }

  async submit() {
    console.log('secret... shhhiu');
    this.checkFields();

    if (this.form.valid) {
      console.log('Senha redefinida com sucesso');
      // Aqui você pode chamar o serviço de redefinição de senha
    } else {
      console.log('Formulário inválido');
    }
  }
}
