import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLayoutsComponent } from './my-layouts.component';

describe('MyLayoutsComponent', () => {
  let component: MyLayoutsComponent;
  let fixture: ComponentFixture<MyLayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLayoutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyLayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
