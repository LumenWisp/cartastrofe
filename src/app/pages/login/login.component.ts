import { Component, OnDestroy } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { FormManager } from '../../shared/form-manager';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-login',
  imports: [
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../shared/auth.css'],
})
export class LoginComponent extends FormManager implements OnDestroy {
  constructor(private router: Router, private userService: UserService) {
    const form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })

    const errorMessages = {
      email: {
        required: 'Email é obrigatório',
        email: 'Email inválido',
      },
      password: {
        required: 'Senha é obrigatória',
        minlength: 'Senha deve ter pelo menos 6 caracteres',
      },
    }

    const formErrorMessages = {
      'auth/invalid-credential': 'Email ou senha inválidos'
    }

    super(form, errorMessages, formErrorMessages);
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

    const { email, password } = this.form.value;

    try{
      await this.userService.login(email, password);
      this.router.navigate(['/my-games']);
    } catch (error){
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-credential') {
          this.setFormError('auth/invalid-credential');
        }

        console.error('Erro ao registrar usuário:', error.code);
      } else {
        console.log('Email ou senha inválidos');
      }
    }
  }
}
