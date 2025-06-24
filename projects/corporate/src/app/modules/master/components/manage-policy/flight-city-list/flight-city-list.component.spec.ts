import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCityListComponent } from './flight-city-list.component';

describe('FlightCityListComponent', () => {
  let component: FlightCityListComponent;
  let fixture: ComponentFixture<FlightCityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightCityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightCityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
