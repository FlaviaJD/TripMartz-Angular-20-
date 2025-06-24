import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTrainingVenueComponent } from './create-update-training-venue.component';

describe('CreateUpdateTrainingVenueComponent', () => {
  let component: CreateUpdateTrainingVenueComponent;
  let fixture: ComponentFixture<CreateUpdateTrainingVenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateTrainingVenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateTrainingVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
