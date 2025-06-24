import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightMisDownloadsComponent } from './flight-mis-downloads.component';

describe('FlightMisDownloadsComponent', () => {
  let component: FlightMisDownloadsComponent;
  let fixture: ComponentFixture<FlightMisDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightMisDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightMisDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
