import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEditRulesComponent } from './game-edit-rules.component';

describe('GameEditRulesComponent', () => {
  let component: GameEditRulesComponent;
  let fixture: ComponentFixture<GameEditRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEditRulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEditRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
