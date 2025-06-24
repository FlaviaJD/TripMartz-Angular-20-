import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomMealTypeComponent } from './room-meal-type.component';

describe('RoomMealTypeComponent', () => {
  let component: RoomMealTypeComponent;
  let fixture: ComponentFixture<RoomMealTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomMealTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomMealTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
