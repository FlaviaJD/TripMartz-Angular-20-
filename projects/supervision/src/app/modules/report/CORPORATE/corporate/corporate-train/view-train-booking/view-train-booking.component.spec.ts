import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrainBookingComponent } from './view-train-booking.component';

describe('ViewTrainBookingComponent', () => {
  let component: ViewTrainBookingComponent;
  let fixture: ComponentFixture<ViewTrainBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTrainBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTrainBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
