// angular
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// primeng
import { updatePreset } from '@primeng/themes';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  constructor() {
    updatePreset({
      semantic: {
        app: {
          body: 'linear-gradient(0, {primary-400} 0%, {secondary-400} 100%)'
        }
      }
    })
  }
}
