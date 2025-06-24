import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusArrivalComponent } from './bus-arrival.component';

describe('BusArrivalComponent', () => {
  let component: BusArrivalComponent;
  let fixture: ComponentFixture<BusArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusArrivalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
