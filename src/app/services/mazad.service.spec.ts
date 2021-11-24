import { TestBed } from '@angular/core/testing';

import { MazadService } from './mazad.service';

describe('MazadService', () => {
  let service: MazadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MazadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
