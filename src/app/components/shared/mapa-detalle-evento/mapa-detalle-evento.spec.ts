import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaDetalleEvento } from './mapa-detalle-evento';

describe('MapaDetalleEvento', () => {
  let component: MapaDetalleEvento;
  let fixture: ComponentFixture<MapaDetalleEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaDetalleEvento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaDetalleEvento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
