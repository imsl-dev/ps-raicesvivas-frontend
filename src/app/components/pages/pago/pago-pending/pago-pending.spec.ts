import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoPending } from './pago-pending';

describe('PagoPending', () => {
  let component: PagoPending;
  let fixture: ComponentFixture<PagoPending>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoPending]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoPending);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
