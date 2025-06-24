import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusPaymentComponent } from './bus-payment.component';

describe('BusPaymentComponent', () => {
  let component: BusPaymentComponent;
  let fixture: ComponentFixture<BusPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
