import { TestBed, async, inject } from '@angular/core/testing';

import { HexoInitGuard } from './hexo-init.guard';

describe('HexoInitGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HexoInitGuard]
    });
  });

  it('should ...', inject([HexoInitGuard], (guard: HexoInitGuard) => {
    expect(guard).toBeTruthy();
  }));
});
