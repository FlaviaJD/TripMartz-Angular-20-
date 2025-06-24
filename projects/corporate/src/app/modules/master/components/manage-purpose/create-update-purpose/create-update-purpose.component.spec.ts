import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdatePurposeComponent } from './create-update-purpose.component';

describe('CreateUpdatePurposeComponent', () => {
  let component: CreateUpdatePurposeComponent;
  let fixture: ComponentFixture<CreateUpdatePurposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdatePurposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdatePurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
