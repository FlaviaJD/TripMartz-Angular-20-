import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainRequestComponent } from './train-request.component';

describe('TrainRequestComponent', () => {
  let component: TrainRequestComponent;
  let fixture: ComponentFixture<TrainRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
