import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelGameComponent } from './panel-game.component';

describe('PanelGameComponent', () => {
  let component: PanelGameComponent;
  let fixture: ComponentFixture<PanelGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
