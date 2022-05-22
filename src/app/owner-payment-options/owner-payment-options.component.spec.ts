import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerPaymentOptionsComponent } from './owner-payment-options.component';

describe('OwnerPaymentOptionsComponent', () => {
  let component: OwnerPaymentOptionsComponent;
  let fixture: ComponentFixture<OwnerPaymentOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerPaymentOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerPaymentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
