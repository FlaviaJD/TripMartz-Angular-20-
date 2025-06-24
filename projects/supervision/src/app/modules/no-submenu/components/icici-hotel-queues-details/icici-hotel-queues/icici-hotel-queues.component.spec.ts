import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IciciHotelQueuesComponent } from './icici-hotel-queues.component';

describe('IciciHotelQueuesComponent', () => {
  let component: IciciHotelQueuesComponent;
  let fixture: ComponentFixture<IciciHotelQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IciciHotelQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IciciHotelQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
