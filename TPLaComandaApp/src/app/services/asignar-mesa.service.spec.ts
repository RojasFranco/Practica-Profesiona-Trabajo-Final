import { TestBed } from '@angular/core/testing';

import { AsignarMesaService } from './asignar-mesa.service';

describe('AsignarMesaService', () => {
  let service: AsignarMesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignarMesaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
