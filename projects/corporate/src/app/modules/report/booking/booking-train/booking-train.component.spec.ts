import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTrainComponent } from './booking-train.component';

describe('BookingTrainComponent', () => {
  let component: BookingTrainComponent;
  let fixture: ComponentFixture<BookingTrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingTrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
