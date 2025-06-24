import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerNameListComponent } from './trainer-name-list.component';

describe('TrainerNameListComponent', () => {
  let component: TrainerNameListComponent;
  let fixture: ComponentFixture<TrainerNameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainerNameListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerNameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
