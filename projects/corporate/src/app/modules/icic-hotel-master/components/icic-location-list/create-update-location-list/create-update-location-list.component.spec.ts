import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateLocationListComponent } from './create-update-location-list.component';

describe('CreateUpdateLocationListComponent', () => {
  let component: CreateUpdateLocationListComponent;
  let fixture: ComponentFixture<CreateUpdateLocationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateLocationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
