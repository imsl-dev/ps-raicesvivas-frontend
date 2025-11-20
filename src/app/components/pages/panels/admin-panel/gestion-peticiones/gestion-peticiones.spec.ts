import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPeticiones } from './gestion-peticiones';

describe('GestionPeticiones', () => {
  let component: GestionPeticiones;
  let fixture: ComponentFixture<GestionPeticiones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPeticiones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPeticiones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
