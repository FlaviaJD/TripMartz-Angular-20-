import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationHotelQueuesComponent } from './cancellation-hotel-queues.component';

describe('CancellationHotelQueuesComponent', () => {
  let component: CancellationHotelQueuesComponent;
  let fixture: ComponentFixture<CancellationHotelQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationHotelQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationHotelQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
