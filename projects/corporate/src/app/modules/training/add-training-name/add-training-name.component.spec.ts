import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainingNameComponent } from './add-training-name.component';

describe('AddTrainingNameComponent', () => {
  let component: AddTrainingNameComponent;
  let fixture: ComponentFixture<AddTrainingNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrainingNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrainingNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
