import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceholderGridComponent } from './placeholder-grid.component';

describe('PlaceholderGridComponent', () => {
  let component: PlaceholderGridComponent;
  let fixture: ComponentFixture<PlaceholderGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceholderGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceholderGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
