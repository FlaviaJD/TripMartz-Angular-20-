import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePositionComponent } from './manage-position.component';

describe('ManagePositionComponent', () => {
  let component: ManagePositionComponent;
  let fixture: ComponentFixture<ManagePositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
