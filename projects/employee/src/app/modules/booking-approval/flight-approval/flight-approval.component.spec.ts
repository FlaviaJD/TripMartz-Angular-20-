import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightApprovalComponent } from './flight-approval.component';

describe('FlightApprovalComponent', () => {
  let component: FlightApprovalComponent;
  let fixture: ComponentFixture<FlightApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
