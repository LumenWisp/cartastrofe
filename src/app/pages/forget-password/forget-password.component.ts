// angular
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
// primeng
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
// shared
import { FormManager } from '../../shared/form-manager';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  imports: [FloatLabelModule, InputTextModule, ButtonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css', '../../shared/auth.css'],
})
export class ForgetPasswordComponent extends FormManager implements OnDestroy {
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

  ngOnDestroy() {
    this.cleanUp();
  }

  async submit() {
    this.checkFields();

    if (this.form.valid) {
      this.resetRequested = true;
      console.log('Solicitação de redefinição enviada');
      // Aqui você pode chamar o serviço de envio de email
    } else {
      console.log('Formulário inválido');
    }
  }
}
