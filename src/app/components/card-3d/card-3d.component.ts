import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-3d.component.html',
  styleUrls: ['./card-3d.component.css']
})
export class Card3dComponent {
  @Input() flip: boolean = false;
  @Input() glow: boolean = false;
  @Input() rotate: boolean = false;
  @Input() frontColor: string = '';
  @Input() backColor: string = '';
  @Input() frontTextColor: string = '';
  @Input() backTextColor: string = '';
  
  // 3D Card Rotation Variables
  isFlipped = false;
  isAnimating = false;

  rotateCard(event: MouseEvent, card3d: HTMLElement) {
    if (!this.rotate) return;

    const rect = card3d.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 22;
    const rotateX = ((centerY - y) / centerY) * 22;
    if (!this.isFlipped) {
      card3d.style.transition = 'transform 0.08s cubic-bezier(.4,0,.2,1)';
      card3d.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    } else {
      card3d.style.transition = 'transform 0.08s cubic-bezier(.4,0,.2,1)';
      card3d.style.transform = `rotateY(${rotateY + 180}deg) rotateX(${-rotateX}deg)`;
    }
  }

  resetCardRotation(card3d: HTMLElement) {
    if (!this.rotate) return;

    if (!this.isFlipped) {
      card3d.style.transition = 'transform 1s cubic-bezier(.4,0,.2,1)';
      card3d.style.transform = 'rotateY(0deg) rotateX(0deg)';
    } else {
      card3d.style.transition = 'transform 1s cubic-bezier(.4,0,.2,1)';
      card3d.style.transform = 'rotateY(180deg) rotateX(0deg)';
    }
  }

  flipCard(card3d: HTMLElement) {
    if (!this.flip) return;

    this.isAnimating = true;
    this.isFlipped = !this.isFlipped;

    if (this.isFlipped) {
      card3d.style.transition = 'transform 0.8s cubic-bezier(.4,0,.2,1)';
      card3d.style.transform = 'rotateY(180deg) rotateX(0deg)';
    } else {
      card3d.style.transition = 'transform 0.8s cubic-bezier(.4,0,.2,1)';
      card3d.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  }
}
