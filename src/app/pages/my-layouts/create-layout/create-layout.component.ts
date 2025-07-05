import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create-layout',
  imports: [RouterOutlet, InputTextModule],
  templateUrl: './create-layout.component.html',
  styleUrl: './create-layout.component.css'
})
export class CreateLayoutComponent {
  value: string = ''
}
