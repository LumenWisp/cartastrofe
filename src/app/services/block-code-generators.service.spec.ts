import { TestBed } from '@angular/core/testing';

import { BlockCodeGeneratorsService } from './block-code-generators.service';

describe('BlockCodeGeneratorsService', () => {
  let service: BlockCodeGeneratorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockCodeGeneratorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
