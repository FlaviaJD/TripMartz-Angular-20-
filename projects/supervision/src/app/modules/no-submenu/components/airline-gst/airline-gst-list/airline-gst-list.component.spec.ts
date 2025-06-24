import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineGstListComponent } from './airline-gst-list.component';

describe('AirlineGstListComponent', () => {
  let component: AirlineGstListComponent;
  let fixture: ComponentFixture<AirlineGstListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlineGstListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlineGstListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
