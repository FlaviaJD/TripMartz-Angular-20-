import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusBookingStepsComponent } from './bus-booking-steps.component';

describe('BusBookingStepsComponent', () => {
  let component: BusBookingStepsComponent;
  let fixture: ComponentFixture<BusBookingStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusBookingStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusBookingStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
