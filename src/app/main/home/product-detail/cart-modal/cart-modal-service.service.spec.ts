import { TestBed } from '@angular/core/testing';

import { CartModalServiceService } from './cart-modal-service.service';

describe('CartModalServiceService', () => {
  let service: CartModalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartModalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
