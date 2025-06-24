import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyTypeListComponent } from './property-type-list.component';

describe('PropertyTypeListComponent', () => {
  let component: PropertyTypeListComponent;
  let fixture: ComponentFixture<PropertyTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
