import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarApprovalTemplateComponent } from './car-approval-template.component';

describe('CarApprovalTemplateComponent', () => {
  let component: CarApprovalTemplateComponent;
  let fixture: ComponentFixture<CarApprovalTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarApprovalTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarApprovalTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
