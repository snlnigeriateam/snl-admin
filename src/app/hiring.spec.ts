import { TestBed } from '@angular/core/testing';

import { Hiring } from './hiring';

describe('Hiring', () => {
  let service: Hiring;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hiring);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
