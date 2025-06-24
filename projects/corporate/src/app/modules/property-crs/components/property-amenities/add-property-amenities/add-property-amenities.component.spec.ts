import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPropertyAmenitiesComponent } from './add-property-amenities.component';

describe('AddPropertyAmenitiesComponent', () => {
  let component: AddPropertyAmenitiesComponent;
  let fixture: ComponentFixture<AddPropertyAmenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPropertyAmenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPropertyAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
