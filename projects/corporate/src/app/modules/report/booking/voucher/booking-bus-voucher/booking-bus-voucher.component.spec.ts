import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingBusVoucherComponent } from './booking-bus-voucher.component';

describe('BookingBusVoucherComponent', () => {
  let component: BookingBusVoucherComponent;
  let fixture: ComponentFixture<BookingBusVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingBusVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingBusVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
