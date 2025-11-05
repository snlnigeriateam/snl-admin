import { TestBed } from '@angular/core/testing';

import { UserTrainings } from './user-trainings';

describe('UserTrainings', () => {
  let service: UserTrainings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTrainings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
