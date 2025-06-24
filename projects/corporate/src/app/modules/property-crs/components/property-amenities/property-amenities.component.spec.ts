import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyAmenitiesComponent } from './property-amenities.component';

describe('PropertyAmenitiesComponent', () => {
  let component: PropertyAmenitiesComponent;
  let fixture: ComponentFixture<PropertyAmenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyAmenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
