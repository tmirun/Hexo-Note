import { TestBed, inject } from '@angular/core/testing';

import { HexoService } from './hexo.service';

describe('HexoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HexoService]
    });
  });

  it('should be created', inject([HexoService], (service: HexoService) => {
    expect(service).toBeTruthy();
  }));
});
