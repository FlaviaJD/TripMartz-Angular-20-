import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainInvoiceComponent } from './train-invoice.component';

describe('TrainInvoiceComponent', () => {
  let component: TrainInvoiceComponent;
  let fixture: ComponentFixture<TrainInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
