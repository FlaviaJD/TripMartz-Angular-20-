import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvUploadedDataComponent } from './csv-uploaded-data.component';

describe('CsvUploadedDataComponent', () => {
  let component: CsvUploadedDataComponent;
  let fixture: ComponentFixture<CsvUploadedDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvUploadedDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvUploadedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
