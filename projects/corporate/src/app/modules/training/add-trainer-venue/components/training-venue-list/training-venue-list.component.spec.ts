import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingVenueListComponent } from './training-venue-list.component';

describe('TrainingVenueListComponent', () => {
  let component: TrainingVenueListComponent;
  let fixture: ComponentFixture<TrainingVenueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingVenueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingVenueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
