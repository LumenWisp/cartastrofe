import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRulesComponent } from './card-rules.component';

describe('CardRulesComponent', () => {
  let component: CardRulesComponent;
  let fixture: ComponentFixture<CardRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
