import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentActiveComponent } from './agent-active.component';

describe('AgentActiveComponent', () => {
  let component: AgentActiveComponent;
  let fixture: ComponentFixture<AgentActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
