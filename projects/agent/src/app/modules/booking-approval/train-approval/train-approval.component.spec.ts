import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainApprovalComponent } from './train-approval.component';

describe('TrainApprovalComponent', () => {
  let component: TrainApprovalComponent;
  let fixture: ComponentFixture<TrainApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
