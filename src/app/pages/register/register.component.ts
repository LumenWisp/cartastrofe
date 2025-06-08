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
export class RegisterComponent {
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private userService: UserService) {}

  onSubmit() {
    if (
      this.registerForm.valid &&
      this.registerForm.value.username &&
      this.registerForm.value.email &&
      this.registerForm.value.password &&
      !this.userService.emailExists(this.registerForm.value.email)
    ) {
      this.userService.registerUser(
        this.registerForm.value.username,
        this.registerForm.value.email,
        this.registerForm.value.password
      );

      this.router.navigate(['/login']);
    }
  }
}
