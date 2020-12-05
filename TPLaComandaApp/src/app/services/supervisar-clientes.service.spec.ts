import { TestBed } from '@angular/core/testing';

import { SupervisarClientesService } from './supervisar-clientes.service';

describe('SupervisarClientesService', () => {
  let service: SupervisarClientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupervisarClientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
