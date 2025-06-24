import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateHotelListComponent } from './create-update-hotel-list.component';

describe('CreateUpdateHotelListComponent', () => {
  let component: CreateUpdateHotelListComponent;
  let fixture: ComponentFixture<CreateUpdateHotelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateHotelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateHotelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
