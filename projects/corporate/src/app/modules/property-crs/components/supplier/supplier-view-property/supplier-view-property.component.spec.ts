import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierViewPropertyComponent } from './supplier-view-property.component';

describe('SupplierViewPropertyComponent', () => {
  let component: SupplierViewPropertyComponent;
  let fixture: ComponentFixture<SupplierViewPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierViewPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierViewPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
