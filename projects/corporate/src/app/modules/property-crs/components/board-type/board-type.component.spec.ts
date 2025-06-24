import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardTypeComponent } from './board-type.component';

describe('BoardTypeComponent', () => {
  let component: BoardTypeComponent;
  let fixture: ComponentFixture<BoardTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
