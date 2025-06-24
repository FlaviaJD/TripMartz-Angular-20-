import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCancellationHotelQueuesComponent } from './update-cancellation-hotel-queues.component';

describe('UpdateCancellationHotelQueuesComponent', () => {
  let component: UpdateCancellationHotelQueuesComponent;
  let fixture: ComponentFixture<UpdateCancellationHotelQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCancellationHotelQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCancellationHotelQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
