import { TestBed } from '@angular/core/testing';

import { BlockWorkspaceService } from './block-workspace.service';

describe('BlockWorkspaceService', () => {
  let service: BlockWorkspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockWorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
