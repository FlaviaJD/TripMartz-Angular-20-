import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcicGuestHouseListComponent } from './icic-guest-house-list.component';

describe('IcicGuestHouseListComponent', () => {
  let component: IcicGuestHouseListComponent;
  let fixture: ComponentFixture<IcicGuestHouseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcicGuestHouseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcicGuestHouseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
