import { TestBed, async, inject } from '@angular/core/testing';

import { ConfigInitGuard } from './config-init.guard';

describe('ConfigInitGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigInitGuard]
    });
  });

  it('should ...', inject([ConfigInitGuard], (guard: ConfigInitGuard) => {
    expect(guard).toBeTruthy();
  }));
});
