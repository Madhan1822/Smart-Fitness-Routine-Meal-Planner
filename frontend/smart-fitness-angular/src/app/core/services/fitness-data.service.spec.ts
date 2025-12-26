import { TestBed } from '@angular/core/testing';

import { FitnessDataService } from './fitness-data.service';

describe('FitnessDataService', () => {
  let service: FitnessDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitnessDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
