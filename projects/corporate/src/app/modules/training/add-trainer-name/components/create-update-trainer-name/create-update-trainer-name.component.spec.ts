import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTrainerNameComponent } from './create-update-trainer-name.component';

describe('CreateUpdateTrainerNameComponent', () => {
  let component: CreateUpdateTrainerNameComponent;
  let fixture: ComponentFixture<CreateUpdateTrainerNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateTrainerNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateTrainerNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
