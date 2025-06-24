import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingApprovalTabsComponent } from './booking-approval-tabs.component';

describe('BookingApprovalTabsComponent', () => {
  let component: BookingApprovalTabsComponent;
  let fixture: ComponentFixture<BookingApprovalTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingApprovalTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingApprovalTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
