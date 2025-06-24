import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingApprovalComponent } from './billing-approval.component';

describe('BillingApprovalComponent', () => {
  let component: BillingApprovalComponent;
  let fixture: ComponentFixture<BillingApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
