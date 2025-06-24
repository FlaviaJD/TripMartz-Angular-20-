import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainPolicyComponent } from './train-policy.component';

describe('TrainPolicyComponent', () => {
  let component: TrainPolicyComponent;
  let fixture: ComponentFixture<TrainPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
