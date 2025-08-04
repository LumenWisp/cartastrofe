import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  imports: [FloatLabelModule, PasswordModule, ButtonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css', '../../shared/auth.css'],
})
export class ResetPasswordComponent {
  resetForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.resetForm.valid) {
      console.log('Senha redefinida com sucesso');
      // Aqui você pode chamar o serviço de redefinição de senha
    } else {
      console.log('Formulário inválido');
    }
  }
}
