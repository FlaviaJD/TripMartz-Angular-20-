import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IciciHotelBookingReportComponent } from './icici-hotel-booking-report.component';

describe('IciciHotelBookingReportComponent', () => {
  let component: IciciHotelBookingReportComponent;
  let fixture: ComponentFixture<IciciHotelBookingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IciciHotelBookingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IciciHotelBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
