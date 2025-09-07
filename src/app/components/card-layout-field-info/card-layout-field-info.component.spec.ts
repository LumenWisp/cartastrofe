import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLayoutFieldInfoComponent } from './card-layout-field-info.component';

describe('CardLayoutFieldInfoComponent', () => {
  let component: CardLayoutFieldInfoComponent;
  let fixture: ComponentFixture<CardLayoutFieldInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardLayoutFieldInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardLayoutFieldInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
