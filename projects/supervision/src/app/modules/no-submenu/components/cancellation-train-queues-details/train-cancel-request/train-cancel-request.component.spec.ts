import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainCancelRequestComponent } from './train-cancel-request.component';

describe('TrainCancelRequestComponent', () => {
  let component: TrainCancelRequestComponent;
  let fixture: ComponentFixture<TrainCancelRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainCancelRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainCancelRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
