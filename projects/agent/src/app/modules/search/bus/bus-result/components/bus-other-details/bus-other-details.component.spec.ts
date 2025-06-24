import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusOtherDetailsComponent } from './bus-other-details.component';

describe('BusOtherDetailsComponent', () => {
  let component: BusOtherDetailsComponent;
  let fixture: ComponentFixture<BusOtherDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusOtherDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
