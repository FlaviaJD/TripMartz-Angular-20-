import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyImageComponent } from './property-image.component';

describe('PropertyImageComponent', () => {
  let component: PropertyImageComponent;
  let fixture: ComponentFixture<PropertyImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
