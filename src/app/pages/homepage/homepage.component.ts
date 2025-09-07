import { Component, AfterViewInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import LocomotiveScroll from 'locomotive-scroll';
import { TranslatePipe, TranslateDirective, TranslateService } from "@ngx-translate/core";
import { Card3dComponent } from '../../components/card-3d/card-3d.component';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink, TranslatePipe, Card3dComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})

export class HomepageComponent implements AfterViewInit {
  scroll: LocomotiveScroll = new LocomotiveScroll;

  translate = inject(TranslateService);

  // Language Variables
  currentLanguage = 'PT-BR';

  // Sidebar Variables
  isSidebarOpen = false;

  ngAfterViewInit() {
    this.scroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]') as HTMLElement,
      smooth: true,
    });
  }
  
  changeLanguage() {
    if (this.currentLanguage === 'PT-BR') {
      this.translate.use('en-US');
      this.currentLanguage = 'EN-US';
    } else {
      this.translate.use('pt');
      this.currentLanguage = 'PT-BR';
    }
  }

  openSidebar() {
    this.isSidebarOpen = true;
    document.body.style.overflow = 'hidden';
  }
  
  closeSidebar() {
    this.isSidebarOpen = false;
    document.body.style.overflow = '';
  }

  onSidebarBackdropClick(event: MouseEvent, sidebar: HTMLElement) {
    if (event.target === sidebar) {
      this.closeSidebar();
    }
  }
}
