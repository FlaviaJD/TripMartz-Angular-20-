import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoardTypeComponent } from './add-board-type.component';

describe('AddBoardTypeComponent', () => {
  let component: AddBoardTypeComponent;
  let fixture: ComponentFixture<AddBoardTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBoardTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBoardTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
