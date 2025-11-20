import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoFailure } from './pago-failure';

describe('PagoFailure', () => {
  let component: PagoFailure;
  let fixture: ComponentFixture<PagoFailure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoFailure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoFailure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
