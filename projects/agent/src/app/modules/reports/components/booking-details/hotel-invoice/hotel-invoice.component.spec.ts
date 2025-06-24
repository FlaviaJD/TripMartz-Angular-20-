import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelInvoiceComponent } from './hotel-invoice.component';

describe('HotelInvoiceComponent', () => {
  let component: HotelInvoiceComponent;
  let fixture: ComponentFixture<HotelInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
