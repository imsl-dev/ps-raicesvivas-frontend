import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCanjeables } from './gestion-canjeables';

describe('GestionCanjeables', () => {
  let component: GestionCanjeables;
  let fixture: ComponentFixture<GestionCanjeables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCanjeables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCanjeables);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
