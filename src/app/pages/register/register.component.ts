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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserEntity } from '../../types/user';
import {UserService} from '../../services/user-service.service'

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
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
  });

  roomLink: string = '';

  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute) {}

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

     if (this.registerForm.valid) {

      const name = this.registerForm.get('name')?.value;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;

      if(name && email && password){
        let register: UserEntity = 
        {
          userID: '',
          name: name,
          email: email,
          password: password,
          cardLayoutsIds: []
        }
        await this.userService.register(register);
        console.log('Registro feito com sucesso');
        this.goToLoginPage()
      }
     }
     else {
       console.log('Formulário inválido');
     }
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
