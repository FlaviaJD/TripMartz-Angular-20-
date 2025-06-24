import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcicLocationListComponent } from './icic-location-list.component';

describe('IcicLocationListComponent', () => {
  let component: IcicLocationListComponent;
  let fixture: ComponentFixture<IcicLocationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcicLocationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcicLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
