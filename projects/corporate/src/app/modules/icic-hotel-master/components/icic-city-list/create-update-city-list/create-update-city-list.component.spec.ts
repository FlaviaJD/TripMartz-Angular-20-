import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCityListComponent } from './create-update-city-list.component';

describe('CreateUpdateCityListComponent', () => {
  let component: CreateUpdateCityListComponent;
  let fixture: ComponentFixture<CreateUpdateCityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateCityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateCityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
