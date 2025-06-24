import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeApprovalComponent } from './employee-approval.component';

describe('EmployeeApprovalComponent', () => {
  let component: EmployeeApprovalComponent;
  let fixture: ComponentFixture<EmployeeApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
