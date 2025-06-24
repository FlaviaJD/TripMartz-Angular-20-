import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingHotelComponent } from './booking-hotel.component';

describe('B2bHotelComponent', () => {
  let component: BookingHotelComponent;
  let fixture: ComponentFixture<BookingHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
