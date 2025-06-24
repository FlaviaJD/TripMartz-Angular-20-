import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTripidComponent } from './create-tripid.component';

describe('CreateTripidComponent', () => {
  let component: CreateTripidComponent;
  let fixture: ComponentFixture<CreateTripidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTripidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTripidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
