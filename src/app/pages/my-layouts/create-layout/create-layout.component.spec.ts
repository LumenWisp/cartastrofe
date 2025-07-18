import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLayoutComponent } from './create-layout.component';

describe('CreateLayoutComponent', () => {
  let component: CreateLayoutComponent;
  let fixture: ComponentFixture<CreateLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
