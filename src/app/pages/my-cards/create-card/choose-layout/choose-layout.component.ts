import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { CardTemplateComponent } from "../../../../components/card-template/card-template.component";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { CardLayoutService } from '../../../../services/card-layout.service';
import { UserService } from '../../../../services/user-service.service';
import { CardLayoutModel } from '../../../../types/card-layout';


@Component({
  selector: 'app-choose-layout',
  imports: [ButtonModule, CardModule, CardTemplateComponent, CommonModule],
  templateUrl: './choose-layout.component.html',
  styleUrl: './choose-layout.component.css'
})
export class ChooseLayoutComponent implements OnInit {

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

  layoutSelected: number | null = null;
  selectCardLayout(index: number) {
    if (this.layoutSelected === index){
      this.layoutSelected = null;
    }
    else {
      this.layoutSelected = index;
    }
  }

  goToCreateCardPage() {
    if(this.layoutSelected !== null){
      this.router.navigate(['/my-cards/create-card', this.layoutSelected]);
    }
  }
}
