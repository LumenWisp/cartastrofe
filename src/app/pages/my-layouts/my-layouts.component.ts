import { Component } from '@angular/core';
import { CardTemplateComponent } from "../../components/card-template/card-template.component";
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-my-layouts',
  imports: [CardTemplateComponent, CardModule, ButtonModule, InputIconModule],
  templateUrl: './my-layouts.component.html',
  styleUrl: './my-layouts.component.css'
})
export class MyLayoutsComponent {

}
