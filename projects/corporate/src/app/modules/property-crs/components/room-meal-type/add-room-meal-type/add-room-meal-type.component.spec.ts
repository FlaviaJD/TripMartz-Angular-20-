import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoomMealTypeComponent } from './add-room-meal-type.component';

describe('AddRoomMealTypeComponent', () => {
  let component: AddRoomMealTypeComponent;
  let fixture: ComponentFixture<AddRoomMealTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoomMealTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoomMealTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
