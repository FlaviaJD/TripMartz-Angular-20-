import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartcipantsListComponent } from './partcipants-list.component';

describe('PartcipantsListComponent', () => {
  let component: PartcipantsListComponent;
  let fixture: ComponentFixture<PartcipantsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartcipantsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartcipantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
