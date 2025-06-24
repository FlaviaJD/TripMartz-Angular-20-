import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusBookingConfirmationComponent } from './bus-booking-confirmation.component';

describe('BusBookingConfirmationComponent', () => {
  let component: BusBookingConfirmationComponent;
  let fixture: ComponentFixture<BusBookingConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusBookingConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusBookingConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
