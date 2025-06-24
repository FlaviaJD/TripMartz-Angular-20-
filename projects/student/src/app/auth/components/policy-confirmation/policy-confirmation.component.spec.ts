import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyConfirmationComponent } from './policy-confirmation.component';

describe('PolicyConfirmationComponent', () => {
  let component: PolicyConfirmationComponent;
  let fixture: ComponentFixture<PolicyConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
