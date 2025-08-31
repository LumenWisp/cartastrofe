import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateCardLayoutComponent } from './modal-create-card-layout.component';

describe('ModalCreateCardLayoutComponent', () => {
  let component: ModalCreateCardLayoutComponent;
  let fixture: ComponentFixture<ModalCreateCardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateCardLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateCardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
