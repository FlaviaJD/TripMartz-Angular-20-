import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineGstComponent } from './airline-gst.component';

describe('AirlineGstComponent', () => {
  let component: AirlineGstComponent;
  let fixture: ComponentFixture<AirlineGstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlineGstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlineGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
