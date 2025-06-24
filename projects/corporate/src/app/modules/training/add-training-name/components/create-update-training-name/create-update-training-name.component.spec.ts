import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTrainingNameComponent } from './create-update-training-name.component';

describe('CreateUpdateTrainingNameComponent', () => {
  let component: CreateUpdateTrainingNameComponent;
  let fixture: ComponentFixture<CreateUpdateTrainingNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateTrainingNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateTrainingNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
