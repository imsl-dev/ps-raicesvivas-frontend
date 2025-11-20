import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoSuccess } from './pago-success';

describe('PagoSuccess', () => {
  let component: PagoSuccess;
  let fixture: ComponentFixture<PagoSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoSuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
