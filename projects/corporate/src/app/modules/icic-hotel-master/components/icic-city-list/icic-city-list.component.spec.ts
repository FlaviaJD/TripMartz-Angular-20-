import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcicCityListComponent } from './icic-city-list.component';

describe('IcicCityListComponent', () => {
  let component: IcicCityListComponent;
  let fixture: ComponentFixture<IcicCityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcicCityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcicCityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
