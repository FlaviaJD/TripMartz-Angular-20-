import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IciciUpdateHotelQueuesComponent } from './icici-update-hotel-queues.component';

describe('IciciUpdateHotelQueuesComponent', () => {
  let component: IciciUpdateHotelQueuesComponent;
  let fixture: ComponentFixture<IciciUpdateHotelQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IciciUpdateHotelQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IciciUpdateHotelQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
