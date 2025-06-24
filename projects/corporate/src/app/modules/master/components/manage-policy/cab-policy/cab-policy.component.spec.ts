import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabPolicyComponent } from './cab-policy.component';

describe('CabPolicyComponent', () => {
  let component: CabPolicyComponent;
  let fixture: ComponentFixture<CabPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
