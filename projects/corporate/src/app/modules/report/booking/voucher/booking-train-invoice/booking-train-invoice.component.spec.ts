import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTrainInvoiceComponent } from './booking-train-invoice.component';

describe('BookingTrainInvoiceComponent', () => {
  let component: BookingTrainInvoiceComponent;
  let fixture: ComponentFixture<BookingTrainInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingTrainInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingTrainInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
