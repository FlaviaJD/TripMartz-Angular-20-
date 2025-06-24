import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingBusComponent } from './booking-bus.component';

describe('BookingBusComponent', () => {
  let component: BookingBusComponent;
  let fixture: ComponentFixture<BookingBusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingBusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
