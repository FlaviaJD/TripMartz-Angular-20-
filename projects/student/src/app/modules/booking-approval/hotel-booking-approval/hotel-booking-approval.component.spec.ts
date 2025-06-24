import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookingApprovalComponent } from './hotel-booking-approval.component';

describe('HotelBookingApprovalComponent', () => {
  let component: HotelBookingApprovalComponent;
  let fixture: ComponentFixture<HotelBookingApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBookingApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
