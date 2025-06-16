import { TestBed } from '@angular/core/testing';

import { EvaluappService } from './evaluapp.service';

describe('EvaluappService', () => {
  let service: EvaluappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
