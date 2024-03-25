import { TestBed } from '@angular/core/testing';

import { SocketNewService } from './socket-new.service';

describe('SocketNewService', () => {
  let service: SocketNewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
