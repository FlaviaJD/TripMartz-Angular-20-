import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRequestComponent } from './hotel-request.component';

describe('HotelRequestComponent', () => {
  let component: HotelRequestComponent;
  let fixture: ComponentFixture<HotelRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
