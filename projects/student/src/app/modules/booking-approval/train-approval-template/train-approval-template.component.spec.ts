import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainApprovalTemplateComponent } from './train-approval-template.component';

describe('TrainApprovalTemplateComponent', () => {
  let component: TrainApprovalTemplateComponent;
  let fixture: ComponentFixture<TrainApprovalTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainApprovalTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainApprovalTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
