import { Component, Input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../types/user';
import {UserService} from '../../services/user-service.service'

@Component({
  selector: 'app-register',
  imports: [FloatLabelModule, InputTextModule, PasswordModule, ButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../shared/auth.css'],
})
export class RegisterComponent {
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  register: User = {name: '', email: '', password: ''}
  users: User[] = [];
  nameInput: string = '';
  emailInput: string = '';
  passwordInput: string = '';

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(){
    this.users = this.userService.getUsers();
  }

  onSubmit() {

    this.register = {name: this.nameInput, email: this.emailInput, password: this.passwordInput} 

    if (this.registerForm.valid && this.users.filter(user => user.email === this.emailInput && user.password === this.passwordInput).length === 0) {

      this.userService.addUser(this.register);
      console.log('Registro feito com sucesso');
      this.router.navigate(['/login']);
    }
    else {
      console.log('Formulário inválido');
      this.nameInput = '';
      this.emailInput = '';
      this.passwordInput = '';
    }
  }
}
