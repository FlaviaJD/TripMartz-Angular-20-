import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAprrovalCreateComponent } from './employee-aprroval-create.component';

describe('EmployeeAprrovalCreateComponent', () => {
  let component: EmployeeAprrovalCreateComponent;
  let fixture: ComponentFixture<EmployeeAprrovalCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAprrovalCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAprrovalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
