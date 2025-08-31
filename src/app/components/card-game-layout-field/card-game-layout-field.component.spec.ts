import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGameLayoutFieldComponent } from './card-game-layout-field.component';

describe('CardGameLayoutFieldComponent', () => {
  let component: CardGameLayoutFieldComponent;
  let fixture: ComponentFixture<CardGameLayoutFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGameLayoutFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGameLayoutFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
