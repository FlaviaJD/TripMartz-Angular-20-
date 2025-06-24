import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyAmenitiesListComponent } from './property-amenities-list.component';

describe('PropertyAmenitiesListComponent', () => {
  let component: PropertyAmenitiesListComponent;
  let fixture: ComponentFixture<PropertyAmenitiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyAmenitiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyAmenitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
