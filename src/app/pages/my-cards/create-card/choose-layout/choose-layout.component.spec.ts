import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseLayoutComponent } from './choose-layout.component';

describe('ChooseLayoutComponent', () => {
  let component: ChooseLayoutComponent;
  let fixture: ComponentFixture<ChooseLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
