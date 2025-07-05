import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import LocomotiveScroll from 'locomotive-scroll';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements AfterViewInit {
  scroll: LocomotiveScroll = new LocomotiveScroll;

  // Language Variables
  currentLanguage = 'PT-BR';

  // Sidebar Variables
  isSidebarOpen = false;

  // 3D Card Rotation Variables
  isFlipped = false;
  isAnimating = false;


  ngAfterViewInit() {
    this.scroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]') as HTMLElement,
      smooth: true,
    });
  }
  
  changeLanguage() {
    this.currentLanguage = this.currentLanguage === 'PT-BR' ? 'EN' : 'PT-BR';
    
    // API here to change language
    alert("This feature is not available yet. Please check back later.");
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

  mouseMoveCard(event: MouseEvent, card3d: HTMLElement) {
      const rect = card3d.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 22;
      const rotateX = ((centerY - y) / centerY) * 22;
      console.log(card3d.style.transform);
      if (!this.isFlipped) {
          card3d.style.transition = 'transform 0.08s cubic-bezier(.4,0,.2,1)';
          card3d.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      } else {
        card3d.style.transition = 'transform 0.08s cubic-bezier(.4,0,.2,1)';
        card3d.style.transform = `rotateY(${rotateY + 180}deg) rotateX(${-rotateX}deg)`;
      }
    };
    
    // Mouse move rotation (works both sides)
    resetCardRotation(card3d: HTMLElement) {
      if (!this.isFlipped) {
          card3d.style.transition = 'transform 1s cubic-bezier(.4,0,.2,1)';
          card3d.style.transform = 'rotateY(0deg) rotateX(0deg)';
      } else {
          card3d.style.transition = 'transform 1s cubic-bezier(.4,0,.2,1)';
          card3d.style.transform = 'rotateY(180deg) rotateX(0deg)';
      }
    };
  // 3D Card Rotation Logic + Flip/Unflip Animation


  // Flip/unflip with animation
  rotateCard(card3d: HTMLElement) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    if (!this.isFlipped) {
      this.isFlipped = true;
      this.isAnimating = false;
      card3d.style.transition = 'transform 0.25s cubic-bezier(.4,0,.2,1)';
      card3d.style.transform = 'rotateY(180deg) rotateX(0deg)';
        
    } else {
      this.isFlipped = false;
      this.isAnimating = false;
      card3d.style.transition = 'transform 0.25s cubic-bezier(.4,0,.2,1)';
      card3d.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  }
}
