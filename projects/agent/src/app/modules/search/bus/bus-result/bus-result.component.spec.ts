import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusResultComponent } from './bus-result.component';

describe('BusResultComponent', () => {
  let component: BusResultComponent;
  let fixture: ComponentFixture<BusResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
