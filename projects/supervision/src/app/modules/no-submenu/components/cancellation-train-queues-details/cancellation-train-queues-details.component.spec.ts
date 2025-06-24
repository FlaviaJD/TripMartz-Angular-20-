import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationTrainQueuesDetailsComponent } from './cancellation-train-queues-details.component';

describe('CancellationTrainQueuesDetailsComponent', () => {
  let component: CancellationTrainQueuesDetailsComponent;
  let fixture: ComponentFixture<CancellationTrainQueuesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationTrainQueuesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationTrainQueuesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
