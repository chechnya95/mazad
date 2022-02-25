import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransactionsComponent } from './payment-transactions.component';

describe('PaymentTransactionsComponent', () => {
  let component: PaymentTransactionsComponent;
  let fixture: ComponentFixture<PaymentTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
