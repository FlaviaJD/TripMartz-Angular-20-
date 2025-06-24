import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCarBookingComponent } from './view-car-booking.component';

describe('ViewCarBookingComponent', () => {
  let component: ViewCarBookingComponent;
  let fixture: ComponentFixture<ViewCarBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCarBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCarBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
