import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarInvoiceComponent } from './car-invoice.component';

describe('CarInvoiceComponent', () => {
  let component: CarInvoiceComponent;
  let fixture: ComponentFixture<CarInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
