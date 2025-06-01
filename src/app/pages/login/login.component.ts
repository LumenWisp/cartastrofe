import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FloatLabelModule, InputTextModule, PasswordModule, ReactiveFormsModule, RouterLink, ButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../shared/auth.css'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login feito com sucesso');
      this.router.navigate(['/my-games']);
    } else {
      console.log('Formulário inválido');
    }
  }
}
