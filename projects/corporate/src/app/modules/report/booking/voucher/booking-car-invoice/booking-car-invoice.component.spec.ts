import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCarInvoiceComponent } from './booking-car-invoice.component';

describe('BookingCarInvoiceComponent', () => {
  let component: BookingCarInvoiceComponent;
  let fixture: ComponentFixture<BookingCarInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingCarInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingCarInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
