import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyconfirmationComponent } from './policyconfirmation.component';

describe('PolicyconfirmationComponent', () => {
  let component: PolicyconfirmationComponent;
  let fixture: ComponentFixture<PolicyconfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyconfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyconfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
