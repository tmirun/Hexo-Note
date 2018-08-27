import { TestBed, async, inject } from '@angular/core/testing';

import { AppInitGuard } from './app-init.guard';

describe('AppInitGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppInitGuard]
    });
  });

  it('should ...', inject([AppInitGuard], (guard: AppInitGuard) => {
    expect(guard).toBeTruthy();
  }));
});
