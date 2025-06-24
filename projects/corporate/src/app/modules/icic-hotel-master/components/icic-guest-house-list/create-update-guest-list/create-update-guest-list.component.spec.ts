import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateGuestListComponent } from './create-update-guest-list.component';

describe('CreateUpdateGuestListComponent', () => {
  let component: CreateUpdateGuestListComponent;
  let fixture: ComponentFixture<CreateUpdateGuestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateGuestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateGuestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
