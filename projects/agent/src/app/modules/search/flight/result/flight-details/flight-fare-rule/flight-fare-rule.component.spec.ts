import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightFareRuleComponent } from './flight-fare-rule.component';

describe('FlightFareRuleComponent', () => {
  let component: FlightFareRuleComponent;
  let fixture: ComponentFixture<FlightFareRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightFareRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightFareRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
