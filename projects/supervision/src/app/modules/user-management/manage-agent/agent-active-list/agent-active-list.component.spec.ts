import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentActiveListComponent } from './agent-active-list.component';

describe('AgentActiveListComponent', () => {
  let component: AgentActiveListComponent;
  let fixture: ComponentFixture<AgentActiveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentActiveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentActiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
