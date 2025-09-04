
// angular
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';
import { TranslatePipe } from '@ngx-translate/core';
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
    TranslatePipe
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../shared/auth.css'],
})
export class RegisterComponent extends FormManager implements OnDestroy {
  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute) {
    const form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;"\'<>,.?/~`]).{8,}$')
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });

    // Add custom error message for strong password pattern
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
        pattern: 'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.',
      },
    };

    super(form, errorMessages);
  }

  roomLink: string = '';

  ngOnInit() {
    this.checkRouteParams();
  }

  ngOnDestroy() {
    this.cleanUp();
  }

  private async checkRouteParams() {
    const roomLink = this.route.snapshot.queryParams['roomLink'];
    console.log('roomLink: ', roomLink);
    if (roomLink) {
      this.roomLink = roomLink;
    }
  }

  async submit() {
    this.checkFields();

    this.form.markAllAsTouched();

    if (!this.form.valid) {
      console.log('Formulário inválido');
      return;
    }

    if (!this.checkPasswordsMatch(this.form.value.password, this.form.value.confirmPassword)) {
      console.log('Senhas não correspondem')
      this.setError('confirmPassword', 'passwordMismatch');
      return;
    }

    const { name, email, password } = this.form.value;

    try {
      await this.userService.register(name, email, password);

      console.log('Registro feito com sucesso');
      this.goToLoginPage()
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

  checkPasswordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  goToLoginPage() {
    if(this.roomLink){
      const queryParams: any = {
      roomLink: this.roomLink,
    };

      this.router.navigate(['/login'], { queryParams,});
    }
    else{
      this.router.navigate(['/login']);
    }
  }
}
