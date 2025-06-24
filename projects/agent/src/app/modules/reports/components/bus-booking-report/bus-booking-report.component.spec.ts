import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusBookingReportComponent } from './bus-booking-report.component';

describe('BusBookingReportComponent', () => {
  let component: BusBookingReportComponent;
  let fixture: ComponentFixture<BusBookingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusBookingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
