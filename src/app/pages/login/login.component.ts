// angular
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute, RouterModule } from '@angular/router';
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
  selector: 'app-login',
  imports: [
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    TranslatePipe
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../shared/auth.css'],
})
export class LoginComponent extends FormManager implements OnDestroy {

  roomUrl: string = '';

  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute, private loadingService: LoadingService) {
    const form = new FormGroup({
      form: new FormControl('', { nonNullable: true }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required, 
          Validators.email
        ]
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      })
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

  ngOnInit() {
    this.checkRouteParams();
    this.loadingService.hide();
  }

  ngOnDestroy() {
    this.cleanUp();
  }

  private async checkRouteParams() {
    const roomUrl = this.route.snapshot.queryParams['roomUrl'];
    if (roomUrl) {
      this.roomUrl = roomUrl;
    }
  }

  async submit() {
    this.checkFields();

    this.form.markAllAsTouched();

    if (!this.form.valid) {
      
      return;
    }
    this.loadingService.show();

    const { email, password } = this.form.value;

    try{
      await this.userService.login(email, password);
      if (this.roomUrl) {
        this.router.navigate([this.roomUrl]);
      } 
      else {
        this.router.navigate(['/my-games']);
      }
    } catch (error){
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-credential') {
          this.setFormError('auth/invalid-credential');
        }

        console.error('Erro ao registrar usuário:', error.code);
      } else {
        
      }
    }
    this.loadingService.hide();
  }
  
  goToRegisterPage() {
    if(this.roomUrl){
      const queryParams: any = {
      roomUrl: this.roomUrl,
    };

      this.router.navigate(['/register'], { queryParams});
    }
    else{
      this.router.navigate(['/register']);
    }
  }
}
