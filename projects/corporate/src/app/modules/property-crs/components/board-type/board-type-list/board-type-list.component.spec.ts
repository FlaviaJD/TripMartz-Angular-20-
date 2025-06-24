import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardTypeListComponent } from './board-type-list.component';

describe('BoardTypeListComponent', () => {
  let component: BoardTypeListComponent;
  let fixture: ComponentFixture<BoardTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
