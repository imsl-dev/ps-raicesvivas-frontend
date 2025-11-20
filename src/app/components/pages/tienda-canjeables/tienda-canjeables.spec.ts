import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaCanjeables } from './tienda-canjeables';

describe('TiendaCanjeables', () => {
  let component: TiendaCanjeables;
  let fixture: ComponentFixture<TiendaCanjeables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendaCanjeables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiendaCanjeables);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
