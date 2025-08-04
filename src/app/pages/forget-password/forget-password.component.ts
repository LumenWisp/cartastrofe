import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  imports: [FloatLabelModule, InputTextModule, ButtonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css', '../../shared/auth.css'],
})
export class ForgetPasswordComponent {
  forgetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  resetRequested = false;

  onSubmit() {
    if (this.forgetForm.valid) {
      this.resetRequested = true;
      console.log('Solicitação de redefinição enviada');
      // Aqui você pode chamar o serviço de envio de email
    } else {
      console.log('Formulário inválido');
    }
  }
}
