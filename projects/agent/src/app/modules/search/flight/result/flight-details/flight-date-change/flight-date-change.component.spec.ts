import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDateChangeComponent } from './flight-date-change.component';

describe('FlightDateChangeComponent', () => {
  let component: FlightDateChangeComponent;
  let fixture: ComponentFixture<FlightDateChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightDateChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightDateChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
