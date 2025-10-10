import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoEventos } from './listado-eventos';

describe('ListadoEventos', () => {
  let component: ListadoEventos;
  let fixture: ComponentFixture<ListadoEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoEventos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoEventos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
