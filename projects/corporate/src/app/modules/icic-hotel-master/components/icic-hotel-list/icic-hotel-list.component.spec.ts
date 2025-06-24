import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcicHotelListComponent } from './icic-hotel-list.component';

describe('IcicHotelListComponent', () => {
  let component: IcicHotelListComponent;
  let fixture: ComponentFixture<IcicHotelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcicHotelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcicHotelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
