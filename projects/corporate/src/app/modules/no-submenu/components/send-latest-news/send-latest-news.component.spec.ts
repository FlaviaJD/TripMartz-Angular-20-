import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendLatestNewsComponent } from './send-latest-news.component';

describe('SendLatestNewsComponent', () => {
  let component: SendLatestNewsComponent;
  let fixture: ComponentFixture<SendLatestNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendLatestNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendLatestNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
