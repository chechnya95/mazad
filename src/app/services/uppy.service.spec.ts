import { TestBed } from '@angular/core/testing';

import { UppyService } from './uppy.service';

describe('UppyService', () => {
  let service: UppyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UppyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
