import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSupplierComponent } from './add-update-supplier.component';

describe('AddUpdateSupplierComponent', () => {
  let component: AddUpdateSupplierComponent;
  let fixture: ComponentFixture<AddUpdateSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
