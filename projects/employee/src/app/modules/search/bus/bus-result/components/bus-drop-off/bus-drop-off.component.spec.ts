import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusDropOffComponent } from './bus-drop-off.component';

describe('BusDropOffComponent', () => {
  let component: BusDropOffComponent;
  let fixture: ComponentFixture<BusDropOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusDropOffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusDropOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
