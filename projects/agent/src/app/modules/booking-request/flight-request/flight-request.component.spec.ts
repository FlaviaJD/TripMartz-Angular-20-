import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightRequestComponent } from './flight-request.component';

describe('FlightRequestComponent', () => {
  let component: FlightRequestComponent;
  let fixture: ComponentFixture<FlightRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
