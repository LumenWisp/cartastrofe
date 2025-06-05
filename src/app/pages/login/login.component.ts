import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../types/user';
import {UserService} from '../../services/user-service.service'

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
  
  emailInput = '';
  passwordInput = '';
  users: User[] = [];
  userTest: User = {userID: 0, name: 'a', email: 'a@a', password:'a'};
  
  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(){
    if(this.userService.getUsers().length === 0){
      this.userService.addUser(this.userTest);
    }
    this.users = this.userService.getUsers();
    console.log("ONICHAN");
    console.log(this.users);
    console.log(this.users[0].userID);
  }

  onSubmit() {
    if (this.loginForm.valid && this.users.filter(user => user.email === this.emailInput && user.password === this.passwordInput).length === 1) {

      this.userService.setUserLogged(this.userService.findUser(this.emailInput, this.passwordInput));

      console.log('Login feito com sucesso');
      console.log(this.userService.getUserLogged())
      this.router.navigate(['/my-games']);
    }
    else {
      console.log('Formulário inválido');
      this.emailInput = '';
      this.passwordInput = '';
    }
  }
}
