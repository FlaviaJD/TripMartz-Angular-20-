import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripidListComponent } from './tripid-list.component';

describe('TripidListComponent', () => {
  let component: TripidListComponent;
  let fixture: ComponentFixture<TripidListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripidListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
