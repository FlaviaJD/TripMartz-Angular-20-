import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookingQueueComponent } from './hotel-booking-queue.component';

describe('HotelBookingQueueComponent', () => {
  let component: HotelBookingQueueComponent;
  let fixture: ComponentFixture<HotelBookingQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBookingQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookingQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
