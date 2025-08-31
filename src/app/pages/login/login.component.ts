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
import {
  Router,
  RouterLink,
  ActivatedRoute,
  RouterModule,
} from '@angular/router';
import { UserService } from '../../services/user-service.service';

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
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  roomLink: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.checkRouteParams();
  }

  private async checkRouteParams() {
    const roomLink = this.route.snapshot.queryParams['roomLink'];
    console.log('roomLink: ', roomLink);
    if (roomLink) {
      this.roomLink = roomLink;
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value
      const password = this.loginForm.get('password')?.value

      if(email && password){
        try{
          await this.userService.login(email, password);
          if (this.roomLink) {
            this.router.navigate(['/rooms', this.roomLink]);
          } else {
            this.router.navigate(['/my-games']);
          }
        } catch (err) {
          console.log('email ou senha inválidos', err);
        }
      }
    }
  }
  
  goToRegisterPage() {
    if(this.roomLink){
      const queryParams: any = {
      roomLink: this.roomLink,
    };

      this.router.navigate(['/register'], { queryParams,});
    }
    else{
      this.router.navigate(['/register']);
    }
  }
}
