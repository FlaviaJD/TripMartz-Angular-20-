import { TestBed } from '@angular/core/testing';

import { IcichotelmaterService } from './icichotelmater.service';

describe('IcichotelmaterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IcichotelmaterService = TestBed.get(IcichotelmaterService);
    expect(service).toBeTruthy();
  });
});
