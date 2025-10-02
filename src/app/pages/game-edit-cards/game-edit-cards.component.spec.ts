import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEditCardsComponent } from './game-edit-cards.component';

describe('GameEditCardsComponent', () => {
  let component: GameEditCardsComponent;
  let fixture: ComponentFixture<GameEditCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEditCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEditCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
