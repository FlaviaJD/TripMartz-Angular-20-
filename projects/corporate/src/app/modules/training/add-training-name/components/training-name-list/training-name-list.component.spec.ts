import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingNameListComponent } from './training-name-list.component';

describe('TrainingNameListComponent', () => {
  let component: TrainingNameListComponent;
  let fixture: ComponentFixture<TrainingNameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingNameListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingNameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
