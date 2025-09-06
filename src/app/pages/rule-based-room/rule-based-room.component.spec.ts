import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleBasedRoomComponent } from './rule-based-room.component';

describe('RuleBasedRoomComponent', () => {
  let component: RuleBasedRoomComponent;
  let fixture: ComponentFixture<RuleBasedRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleBasedRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuleBasedRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
