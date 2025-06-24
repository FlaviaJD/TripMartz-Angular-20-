import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFailedComponent } from './booking-failed.component';

describe('BookingFailedComponent', () => {
  let component: BookingFailedComponent;
  let fixture: ComponentFixture<BookingFailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingFailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
