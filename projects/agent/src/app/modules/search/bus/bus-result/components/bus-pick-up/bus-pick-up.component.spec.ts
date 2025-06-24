import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusPickUpComponent } from './bus-pick-up.component';

describe('BusPickUpComponent', () => {
  let component: BusPickUpComponent;
  let fixture: ComponentFixture<BusPickUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusPickUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusPickUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
