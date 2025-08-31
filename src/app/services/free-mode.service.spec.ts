import { TestBed } from '@angular/core/testing';

import { FreeModeService } from './free-mode.service';

describe('FreeModeService', () => {
  let service: FreeModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreeModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
