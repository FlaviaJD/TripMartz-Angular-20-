import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationHotelQueuesDetailsComponent } from './cancellation-hotel-queues-details.component';

describe('CancellationHotelQueuesDetailsComponent', () => {
  let component: CancellationHotelQueuesDetailsComponent;
  let fixture: ComponentFixture<CancellationHotelQueuesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationHotelQueuesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationHotelQueuesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
