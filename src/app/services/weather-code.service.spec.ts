import { TestBed } from '@angular/core/testing';

import { WeatherCodeService } from './weather-code.service';

describe('WeatherCodeService', () => {
  let service: WeatherCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
