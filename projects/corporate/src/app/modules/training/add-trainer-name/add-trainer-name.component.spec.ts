import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainerNameComponent } from './add-trainer-name.component';

describe('AddTrainerNameComponent', () => {
  let component: AddTrainerNameComponent;
  let fixture: ComponentFixture<AddTrainerNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrainerNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrainerNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
