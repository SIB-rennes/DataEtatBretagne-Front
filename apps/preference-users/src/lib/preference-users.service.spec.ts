import { TestBed } from '@angular/core/testing';

import { PreferenceUsersService } from './preference-users.service';

describe('PreferenceUsersService', () => {
  let service: PreferenceUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreferenceUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
