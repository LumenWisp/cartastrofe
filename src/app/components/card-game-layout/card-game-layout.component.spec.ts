import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGameLayoutComponent } from './card-game-layout.component';

describe('CardGameLayoutComponent', () => {
  let component: CardGameLayoutComponent;
  let fixture: ComponentFixture<CardGameLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGameLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGameLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
