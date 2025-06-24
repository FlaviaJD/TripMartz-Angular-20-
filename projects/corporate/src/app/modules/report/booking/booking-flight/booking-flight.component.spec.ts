import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFlightComponent } from './booking-flight.component';

describe('B2bFlightComponent', () => {
  let component: BookingFlightComponent;
  let fixture: ComponentFixture<BookingFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
