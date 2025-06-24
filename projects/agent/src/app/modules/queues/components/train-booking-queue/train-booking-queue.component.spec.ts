import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainBookingQueueComponent } from './train-booking-queue.component';

describe('TrainBookingQueueComponent', () => {
  let component: TrainBookingQueueComponent;
  let fixture: ComponentFixture<TrainBookingQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainBookingQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainBookingQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
