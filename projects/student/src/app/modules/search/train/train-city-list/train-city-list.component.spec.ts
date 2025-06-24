import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainCityListComponent } from './train-city-list.component';

describe('TrainCityListComponent', () => {
  let component: TrainCityListComponent;
  let fixture: ComponentFixture<TrainCityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainCityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainCityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
