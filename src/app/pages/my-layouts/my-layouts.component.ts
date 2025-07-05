import { Component } from '@angular/core';
import { CardTemplateComponent } from "../../components/card-template/card-template.component";
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-my-layouts',
  imports: [CardTemplateComponent, CardModule, ButtonModule, InputIconModule, RouterOutlet],
  templateUrl: './my-layouts.component.html',
  styleUrl: './my-layouts.component.css'
})
export class MyLayoutsComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

  goToCreateLayoutPage() {

    console.log(this.route)

    this.router.navigate(['create-layout'], {
      relativeTo: this.route
    });
  }

}
