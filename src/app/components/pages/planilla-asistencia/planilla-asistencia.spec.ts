import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaAsistencia } from './planilla-asistencia';

describe('PlanillaAsistencia', () => {
  let component: PlanillaAsistencia;
  let fixture: ComponentFixture<PlanillaAsistencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanillaAsistencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanillaAsistencia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
