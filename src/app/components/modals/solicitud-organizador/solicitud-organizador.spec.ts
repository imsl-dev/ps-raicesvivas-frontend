import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudOrganizador } from './solicitud-organizador';

describe('SolicitudOrganizador', () => {
  let component: SolicitudOrganizador;
  let fixture: ComponentFixture<SolicitudOrganizador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudOrganizador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudOrganizador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
