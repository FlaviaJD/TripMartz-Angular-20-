import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyApprovalComponent } from './policy-approval.component';

describe('PolicyApprovalComponent', () => {
  let component: PolicyApprovalComponent;
  let fixture: ComponentFixture<PolicyApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
