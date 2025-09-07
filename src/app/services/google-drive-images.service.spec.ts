import { TestBed } from '@angular/core/testing';

import { GoogleDriveImagesService } from './google-drive-images.service';

describe('GoogleDriveImagesService', () => {
  let service: GoogleDriveImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleDriveImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
