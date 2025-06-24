import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationTrainQueuesComponent } from './cancellation-train-queues.component';

describe('CancellationTrainQueuesComponent', () => {
  let component: CancellationTrainQueuesComponent;
  let fixture: ComponentFixture<CancellationTrainQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationTrainQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationTrainQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
