import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePurposeComponent } from './manage-purpose.component';

describe('ManagePurposeComponent', () => {
  let component: ManagePurposeComponent;
  let fixture: ComponentFixture<ManagePurposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePurposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
