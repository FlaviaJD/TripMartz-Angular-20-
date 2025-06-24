import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCancellationTrainQueuesComponent } from './update-cancellation-train-queues.component';

describe('UpdateCancellationTrainQueuesComponent', () => {
  let component: UpdateCancellationTrainQueuesComponent;
  let fixture: ComponentFixture<UpdateCancellationTrainQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCancellationTrainQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCancellationTrainQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
