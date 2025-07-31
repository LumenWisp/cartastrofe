
// angular
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';
// primeng
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
// services
import { UserService } from '../../services/user-service.service';
// shared
import { FormManager } from '../../shared/form-manager';

@Component({
  selector: 'app-register',
  imports: [
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../shared/auth.css'],
})
export class RegisterComponent extends FormManager implements OnDestroy {
  constructor(private router: Router, private userService: UserService) {
    const form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    const errorMessages = {
      name: {
        required: 'Nome é obrigatório',
      },
      email: {
        required: 'Email é obrigatório',
        email: 'Email inválido',
        'auth/email-already-in-use': 'Email já está em uso',
      },
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
    this.checkFields();

    if (!this.form.valid) {
      console.log('Formulário inválido');
      return;
    }

    const { name, email, password } = this.form.value;

    try {
      await this.userService.register(name, email, password);

      console.log('Registro feito com sucesso');
      this.router.navigate(['/login']);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          this.setError('email', 'auth/email-already-in-use');
        } else if (error.code === 'auth/invalid-email') {
          this.setError('email', 'email');
        }

        console.error('Erro ao registrar usuário:', error.code);
      } else {
        console.error('Erro desconhecido ao registrar usuário:', error);
      }
    }
  }
}
