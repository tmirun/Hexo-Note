import { TestBed, inject } from '@angular/core/testing';

import { SystemSettingsService } from './system-settings.service';

describe('SystemSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemSettingsService]
    });
  });

  it('should be created', inject([SystemSettingsService], (service: SystemSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
