import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomMealTypeListComponent } from './room-meal-type-list.component';

describe('RoomMealTypeListComponent', () => {
  let component: RoomMealTypeListComponent;
  let fixture: ComponentFixture<RoomMealTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomMealTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomMealTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
