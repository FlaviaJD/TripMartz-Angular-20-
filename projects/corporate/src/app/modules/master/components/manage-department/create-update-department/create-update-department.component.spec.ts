import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateDepartmentComponent } from './create-update-department.component';

describe('CreateUpdateDepartmentComponent', () => {
  let component: CreateUpdateDepartmentComponent;
  let fixture: ComponentFixture<CreateUpdateDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
