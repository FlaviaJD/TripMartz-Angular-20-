import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRequestTabsComponent } from './booking-request-tabs.component';

describe('BookingRequestTabsComponent', () => {
  let component: BookingRequestTabsComponent;
  let fixture: ComponentFixture<BookingRequestTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingRequestTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingRequestTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
