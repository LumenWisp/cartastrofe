import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { UserService } from './services/user-service.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'cartastrofe';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      if (user) {
        this.userService.currentUser.set({
          email: user.email!,
          userID: user.uid,
        })
      } else {
        this.userService.currentUser.set(null)
      }
    })
  }
}
