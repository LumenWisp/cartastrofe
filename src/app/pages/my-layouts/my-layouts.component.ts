import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { CardTemplateComponent } from "../../components/card-template/card-template.component";
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { ActivatedRoute, Router } from '@angular/router';
import { CardLayoutService } from '../../services/card-layout.service';
import { UserService } from '../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { CardLayoutModel } from '../../types/card-layout';

@Component({
  selector: 'app-my-layouts',
  imports: [CardTemplateComponent, CardModule, ButtonModule, InputIconModule, CommonModule],
  templateUrl: './my-layouts.component.html',
  styleUrl: './my-layouts.component.css'
})
export class MyLayoutsComponent implements OnInit {

  @ViewChild('panels') panelsEl: ElementRef<HTMLDivElement> | undefined;
  cardLayouts: CardLayoutModel[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cardLayoutService: CardLayoutService,
    private userService: UserService,
  ) {}

  async ngOnInit() { 
    this.cardLayouts = await this.cardLayoutService.fetchCardLayouts(this.userService.getUserLogged()!.userID)
  }

  @HostListener('window:resize')
  remainingCardLayoutSpace() {
    if (!this.panelsEl) return [];
    const style = getComputedStyle(this.panelsEl.nativeElement);
    const columns = style.getPropertyValue('grid-template-columns');
    const countColumns = columns.split(' ').length
    const count = (this.cardLayoutService.totalCardLayouts + 1) % countColumns === 0
      ? countColumns
      : countColumns - 1 - this.cardLayoutService.totalCardLayouts % countColumns
    return new Array(count).fill(null);
  }

  goToCreateLayoutPage() {
    this.router.navigate(['create-layout'], {
      relativeTo: this.route
    });
  }
}
