import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingBusInvoiceComponent } from './booking-bus-invoice.component';

describe('BookingBusInvoiceComponent', () => {
  let component: BookingBusInvoiceComponent;
  let fixture: ComponentFixture<BookingBusInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingBusInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingBusInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
