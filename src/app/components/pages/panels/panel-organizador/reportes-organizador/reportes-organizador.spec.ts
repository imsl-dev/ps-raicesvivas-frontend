import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesOrganizador } from './reportes-organizador';

describe('ReportesOrganizador', () => {
  let component: ReportesOrganizador;
  let fixture: ComponentFixture<ReportesOrganizador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesOrganizador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesOrganizador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
