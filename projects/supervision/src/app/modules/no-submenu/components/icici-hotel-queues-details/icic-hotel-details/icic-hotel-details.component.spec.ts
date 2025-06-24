import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcicHotelDetailsComponent } from './icic-hotel-details.component';

describe('IcicHotelDetailsComponent', () => {
  let component: IcicHotelDetailsComponent;
  let fixture: ComponentFixture<IcicHotelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcicHotelDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcicHotelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
