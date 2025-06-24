import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageActiveCreateAgentComponent } from './manage-active-create-agent.component';

describe('ManageActiveCreateAgentComponent', () => {
  let component: ManageActiveCreateAgentComponent;
  let fixture: ComponentFixture<ManageActiveCreateAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageActiveCreateAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageActiveCreateAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
