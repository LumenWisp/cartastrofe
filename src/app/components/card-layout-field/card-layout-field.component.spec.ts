import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLayoutFieldComponent } from './card-layout-field.component';

describe('CardLayoutFieldComponent', () => {
  let component: CardLayoutFieldComponent;
  let fixture: ComponentFixture<CardLayoutFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardLayoutFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardLayoutFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
