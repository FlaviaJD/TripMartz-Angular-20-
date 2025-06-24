import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineGstAddUpdateComponent } from './airline-gst-add-update.component';

describe('AirlineGstAddUpdateComponent', () => {
  let component: AirlineGstAddUpdateComponent;
  let fixture: ComponentFixture<AirlineGstAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlineGstAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlineGstAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
