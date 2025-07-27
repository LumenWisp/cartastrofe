import { Component } from '@angular/core';
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
import { UserEntity } from '../../types/user';
import { UserService } from '../../services/user-service.service';
import { FormBase } from '../../shared/form-base';

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
export class RegisterComponent extends FormBase {
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
      },
      password: {
        required: 'Senha é obrigatória',
        minlength: 'Senha deve ter pelo menos 6 caracteres',
      },
    };

    super(form, errorMessages);
  }

  async submit() {
    if (this.form.valid) {
      const name = this.form.get('name')?.value;
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;

      if (name && email && password) {
        let register: UserEntity = {
          userID: '',
          name: name,
          email: email,
          password: password,
        };
        await this.userService.register(register);
        console.log('Registro feito com sucesso');
        this.router.navigate(['/login']);
      }
    } else {
      console.log('Formulário inválido');
    }
  }
}
