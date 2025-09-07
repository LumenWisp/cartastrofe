// angular
import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-placeholder-grid',
  templateUrl: './placeholder-grid.component.html',
  styleUrl: './placeholder-grid.component.css',
})
export class PlaceholderGridComponent implements AfterViewInit {
  @Input() minColumnSize = 300;
  @ViewChild('grid') grid!: ElementRef<HTMLDivElement>;
  placeholders: null[] = [];
  private mutationObserver!: MutationObserver;

  ngAfterViewInit() {
    this.calculatePlaceholders();

    this.mutationObserver = new MutationObserver(() => {
      this.calculatePlaceholders();
    });
    this.mutationObserver.observe(this.grid.nativeElement, { childList: true });
  }

  ngOnDestroy() {
    this.mutationObserver.disconnect();
  }

  @HostListener('window:resize')
  calculatePlaceholders() {
    const style = getComputedStyle(this.grid.nativeElement);
    const columns = style.getPropertyValue('grid-template-columns').split(' ').length;
    const totalItems = this.grid.nativeElement.children.length - this.placeholders.length;
    const itemsInLastRow = totalItems % columns;
    const placeholdersNeeded = itemsInLastRow === 0 ? 0 : columns - itemsInLastRow;
    this.placeholders = new Array(placeholdersNeeded).fill(null);
  }
}
