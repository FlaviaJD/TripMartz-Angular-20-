import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightApprovalListComponent } from './flight-approval-list.component';

describe('FlightApprovalListComponent', () => {
  let component: FlightApprovalListComponent;
  let fixture: ComponentFixture<FlightApprovalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightApprovalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
