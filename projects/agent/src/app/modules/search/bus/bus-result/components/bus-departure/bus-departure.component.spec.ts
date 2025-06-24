import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusDepartureComponent } from './bus-departure.component';

describe('BusDepartureComponent', () => {
  let component: BusDepartureComponent;
  let fixture: ComponentFixture<BusDepartureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusDepartureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
