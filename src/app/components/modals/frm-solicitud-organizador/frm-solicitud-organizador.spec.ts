import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmSolicitudOrganizador } from './frm-solicitud-organizador';

describe('FrmSolicitudOrganizador', () => {
  let component: FrmSolicitudOrganizador;
  let fixture: ComponentFixture<FrmSolicitudOrganizador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrmSolicitudOrganizador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrmSolicitudOrganizador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
