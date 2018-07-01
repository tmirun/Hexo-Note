import { TestBed, inject } from '@angular/core/testing';

import { ScaffoldService } from './scaffold.service';

describe('ScaffoldService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScaffoldService]
    });
  });

  it('should be created', inject([ScaffoldService], (service: ScaffoldService) => {
    expect(service).toBeTruthy();
  }));
});
