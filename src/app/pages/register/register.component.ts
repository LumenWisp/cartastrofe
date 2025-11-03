
// angular
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';
import { TranslatePipe } from '@ngx-translate/core';
// primeng
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
// services
import { UserService } from '../../services/user-service.service';
import { LoadingService } from '../../services/loading.service';
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
    TranslatePipe
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../shared/auth.css'],
})
export class RegisterComponent extends FormManager implements OnDestroy {
  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute, private loadingService: LoadingService) {
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
    if (roomLink) {
      this.roomLink = roomLink;
    }
  }

  async submit() {
    this.checkFields();

    this.form.markAllAsTouched();

    if (!this.form.valid) {
      
      return;
    }

    if (!this.checkPasswordsMatch(this.form.value.password, this.form.value.confirmPassword)) {
      
      this.setError('confirmPassword', 'passwordMismatch');
      return;
    }

    this.loadingService.show();

    const { name, email, password } = this.form.value;

    try {
      await this.userService.register(name, email, password);

      
      this.goToLoginPage()
    } catch (error) {
      this.loadingService.hide();
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
