import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { UserEntity } from '../../types/user';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-rooms',
  imports: [PanelModule, ButtonModule, RouterModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent {

  users: UserEntity[] = [];

  constructor(
    private userService: UserService
  ){}

  async ngOnInit(){
    const userCreator = this.userService.getUserLogged()
    if(userCreator){
      this.users.push(userCreator);
    }
  }

}
