import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPolicyComponent } from './flight-policy.component';

describe('FlightPolicyComponent', () => {
  let component: FlightPolicyComponent;
  let fixture: ComponentFixture<FlightPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
