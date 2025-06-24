import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelStateListComponent } from './hotel-state-list.component';

describe('HotelStateListComponent', () => {
  let component: HotelStateListComponent;
  let fixture: ComponentFixture<HotelStateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelStateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelStateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
