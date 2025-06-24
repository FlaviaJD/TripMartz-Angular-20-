import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestHouseListComponent } from './guest-house-list.component';

describe('GuestHouseListComponent', () => {
  let component: GuestHouseListComponent;
  let fixture: ComponentFixture<GuestHouseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestHouseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestHouseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
