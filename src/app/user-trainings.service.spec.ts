import { TestBed } from '@angular/core/testing';

import { UserTrainingsService } from './user-trainings.service';

describe('UserTrainingsService', () => {
  let service: UserTrainingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTrainingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
