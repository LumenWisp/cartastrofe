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
import { UserService } from '../../services/user-service.service';
import { FormBase } from '../../shared/form-base';

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
export class LoginComponent extends FormBase {
  constructor(private router: Router, private userService: UserService) {
    const form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    const errorMessages = {
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
      const email = this.form.get('email')?.value
      const password = this.form.get('password')?.value

      if(email && password){
        try{
          await this.userService.login(email, password);
          this.router.navigate(['/my-games']);
        }
        catch(err){
          console.log("email ou senha inválidos", err)
        }
      }
    }
  }
}
