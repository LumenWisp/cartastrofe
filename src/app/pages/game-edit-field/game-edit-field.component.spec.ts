import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEditFieldComponent } from './game-edit-field.component';

describe('GameEditFieldComponent', () => {
  let component: GameEditFieldComponent;
  let fixture: ComponentFixture<GameEditFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEditFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEditFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
