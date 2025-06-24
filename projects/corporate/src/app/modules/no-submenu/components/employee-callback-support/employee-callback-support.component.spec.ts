import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCallbackSupportComponent } from './employee-callback-support.component';

describe('EmployeeCallbackSupportComponent', () => {
  let component: EmployeeCallbackSupportComponent;
  let fixture: ComponentFixture<EmployeeCallbackSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeCallbackSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCallbackSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
